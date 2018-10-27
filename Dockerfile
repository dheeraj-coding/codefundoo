FROM node:10
WORKDIR /app
COPY . /app
RUN python get-pip.py
RUN npm install
RUN python -m pip install -r requirements.txt
EXPOSE 80 443
ENV PORT 80
CMD ["npm","start"]
