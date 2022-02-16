FROM directus/directus:9.5.1

COPY ./snapshot.yaml .

CMD npx directus bootstrap && npx directus schema apply --yes snapshot.yaml && npx directus start
