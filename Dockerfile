FROM gitlab.sistematis.com.ar:4567/open-source/go/sims:master

ENV NAME="YoMeOcupo"
ARG VERSION
ENV VERSION=$VERSION

COPY YoMeOcupo /html
