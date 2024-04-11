import path, { dirname } from 'node:path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'

export const upFile = (files, extencionesValidas = ['png', 'jpg', 'jpg', 'jpeg', 'webp'], carpeta = '') => {
  return new Promise((resolve, reject) => {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    const archivo = Object.values(files)[0]
    const nombreCortado = archivo.name.split('.')
    const extencion = nombreCortado[nombreCortado.length - 1]

    // Validar la extension
    if (!extencionesValidas.includes(extencion)) {
      return reject(new Error(`La extension ${extencion} no es permitida, - ${extencionesValidas}`))
    }
    const uuidName = uuidv4()
    const nombreTemp = uuidName + '.' + extencion
    const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp)

    archivo.mv(uploadPath, (err) => {
      if (err) {
        reject(err)
      }
      const staticPath = `/${carpeta}/${nombreTemp}`
      resolve(staticPath)
    })
  }
  )
}

export const upFiles = async (files, extencionesValidas = ['png', 'jpg', 'jpeg', 'webp'], carpeta = '') => {
  const uploadedFiles = []
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const filesArray = Array.isArray(files) ? files : [files]
  if (filesArray.length > 5) {
    throw new Error('No se pueden subir más de 5 archivos a la vez.')
  } else {
    for (const file of Object.values(filesArray)) {
      // console.log(file)
      const nombreCortado = file.name.split('.')
      const extencion = nombreCortado[nombreCortado.length - 1]

      // Validar la extension
      if (!extencionesValidas.includes(extencion)) {
        throw new Error(`La extension ${extencion} no es permitida, - ${extencionesValidas}`)
      }
      const uuidName = uuidv4()
      const nombreTemp = uuidName + '.' + extencion
      const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp)

      await new Promise((resolve, reject) => {
        file.mv(uploadPath, (err) => {
          if (err) {
            reject(err)
          }
          resolve()
        })
      })
      const staticPath = `/${carpeta}/${nombreTemp}`
      uploadedFiles.push(staticPath)
    }
  }

  return uploadedFiles
}
