FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем зависимости и устанавливаем
COPY package*.json ./
RUN npm install

# Копируем весь проект
COPY . .

# CRA слушает порт 3000
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]
