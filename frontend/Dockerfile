FROM node:20

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# すでにビルド済みの場合は .next をコピー
COPY .next .next

EXPOSE 3000
CMD ["npm", "run", "start"]