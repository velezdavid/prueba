# Usar una imagen base de Node.js
FROM node:18

# Establecer el directorio de trabajo en /app
WORKDIR /app

# Copiar el archivo de configuración de dependencias
COPY package.json package-lock.json ./

# Instalar las dependencias
RUN npm install --force

# Copiar el contenido del directorio actual al directorio de trabajo en el contenedor
COPY . .

# Construir la aplicación de React
RUN npm run build

# Exponer el puerto 80 (o el puerto que use tu servidor web)
EXPOSE 80

# Definir el comando para servir la aplicación
CMD ["npm", "start"]