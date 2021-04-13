FROM node:12.18.1 as builder
RUN mkdir -p /opt/work
COPY . /opt/work/source
RUN cd /opt/work/source && npm run build

FROM node:slim
RUN mkdir /opt/app
COPY --from=builder /opt/work/source/dist /opt/app
COPY --from=builder /opt/work/source/node_modules /opt/app/node_modules
ENTRYPOINT ["node"]
CMD ["/opt/app/index.js"]

