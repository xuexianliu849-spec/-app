/**
 * Google Drive Backup & Sync Service
 * Handles client-side export and restore of habit data.
 */

// Define the shape of our backup data
export interface BackupData {
  version: string;
  timestamp: string;
  coins: number;
  diamonds: number;
  tasks: any[];
  rewards: any[];
}

declare global {
  interface Window {
    google?: any;
  }
}

const BACKUP_FILE_NAME = 'habit_warrior_backup.json';

/**
 * Initiates the Google Identity Services token flow to get an access token
 * with the 'https://www.googleapis.com/auth/drive.file' scope.
 */
export function getGoogleAccessToken(clientId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject(new Error('Google Identity Services SDK 未加载，请刷新页面或检查网络。'));
      return;
    }

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId || '75811403213-placeholder.apps.googleusercontent.com', // fallback placeholder
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: (response: any) => {
          if (response.error_description) {
            reject(new Error(`登录失败: ${response.error_description}`));
          } else if (response.access_token) {
            resolve(response.access_token);
          } else {
            reject(new Error('未获得有效的 Access Token'));
          }
        },
      });
      client.requestAccessToken();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Searches for the existing backup file in Google Drive.
 * Returns the file ID if found, otherwise null.
 */
async function findBackupFile(accessToken: string): Promise<{ id: string } | null> {
  const query = encodeURIComponent(`name = '${BACKUP_FILE_NAME}' and trashed = false`);
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&spaces=drive`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`无法查询 Google Drive 文件: ${errText}`);
  }

  const data = await response.json();
  if (data.files && data.files.length > 0) {
    return { id: data.files[0].id };
  }
  return null;
}

/**
 * Uploads (or updates) the backup data to Google Drive.
 */
export async function uploadToDrive(accessToken: string, backupData: BackupData): Promise<string> {
  const existingFile = await findBackupFile(accessToken);
  const boundary = 'foo_bar_baz_boundary';
  
  const metadata = {
    name: BACKUP_FILE_NAME,
    mimeType: 'application/json',
    description: '习惯小勇士（Habit Warrior）自动云端备份数据',
  };

  const mediaContent = JSON.stringify(backupData, null, 2);

  // Multipart body composition
  const multipartBody = 
    `\r\n--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(metadata)}\r\n` +
    `\r\n--${boundary}\r\n` +
    `Content-Type: application/json\r\n\r\n` +
    `${mediaContent}\r\n` +
    `--${boundary}--`;

  let url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
  let method = 'POST';

  if (existingFile) {
    // Update existing file instead of creating a new one
    url = `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=multipart`;
    method = 'PATCH';
  }

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartBody,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`备份到 Google Drive 失败: ${errText}`);
  }

  const result = await response.json();
  return result.id;
}

/**
 * Downloads the backup data from Google Drive.
 */
export async function downloadFromDrive(accessToken: string): Promise<BackupData> {
  const existingFile = await findBackupFile(accessToken);
  if (!existingFile) {
    throw new Error('未在您的 Google Drive 中找到备份文件。请先进行备份！');
  }

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${existingFile.id}?alt=media`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`下载备份数据失败: ${errText}`);
  }

  const data = await response.json();
  return data as BackupData;
}

/**
 * Downloads a local JSON backup file to the user's computer.
 */
export function exportLocalBackup(backupData: BackupData) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", BACKUP_FILE_NAME);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
