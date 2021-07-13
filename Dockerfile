# pull official base image
FROM node:15.13-alpine

# set working directory
WORKDIR /styliff-task

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# add the folder
COPY . .

# run build script
RUN npm run build

# start app
CMD ["npm", "start"]