FROM node:18
# isse node + linux sath me kam krta h 

WORKDIR /app

# isse image kis folder me jayegi wo decide hoga

COPY package*.json ./

# isse package.json or package-lock.json dono copy ho jayegi
# start ka mtlb h jo package se start ho or extention .json ho wo sab

RUN npm install 
# isse dependency install kr lega

COPY server.js ./
# isse server.js copy krega

EXPOSE 3000
# isse is port par sabhi requests accept krega 

CMD ["node","server.js"]
# isse command run krega server start karne ke liye 