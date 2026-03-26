import { google } from 'googleapis'
import { Readable } from 'stream'

function getAuth() {
  const json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!json) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON env var is not set')
  const credentials = JSON.parse(json)
  return new google.auth.GoogleAuth({
    credentials,
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  })
}

/**
 * Uploads a file buffer to Google Drive.
 * Returns the public URL of the uploaded file.
 * @param {Buffer} buffer
 * @param {string} fileName
 * @param {string} mimeType
 * @param {string} folderId - Google Drive folder ID
 */
export async function uploadToDrive(buffer, fileName, mimeType, folderId) {
  const auth = getAuth()
  const drive = google.drive({ version: 'v3', auth })

  const stream = Readable.from(buffer)

  const res = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: stream,
    },
    fields: 'id, webViewLink',
  })

  const fileId = res.data.id

  // Make the file viewable by anyone with the link
  await drive.permissions.create({
    fileId,
    requestBody: { role: 'reader', type: 'anyone' },
  })

  return res.data.webViewLink
}

/**
 * Appends a row to a Google Sheet.
 * @param {string} spreadsheetId
 * @param {any[]} values - array of cell values for the row
 */
export async function appendToSheet(spreadsheetId, values) {
  const auth = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Sheet1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [values] },
  })
}

/**
 * Reads all rows from a Google Sheet.
 * Returns an array of row arrays (skips the header row).
 * @param {string} spreadsheetId
 */
export async function getSheetRows(spreadsheetId) {
  const auth = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Sheet1',
  })

  const rows = res.data.values || []
  // Skip header row if present
  return rows.length > 1 ? rows.slice(1) : []
}
