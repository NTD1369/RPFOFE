FROM nginx:1.17.1-alpine 
COPY /dist/RPFOFE /usr/share/nginx/html
COPY loaderio-ca70b6483dc8d458f24cea9c874b991a /usr/share/nginx/html
COPY loaderio-ca70b6483dc8d458f24cea9c874b991a.txt /usr/share/nginx/html
COPY loaderio-ca70b6483dc8d458f24cea9c874b991a.html /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]