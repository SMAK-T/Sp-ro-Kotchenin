# Contenus Sanity

Les schémas sont dans `schemaTypes/`, l’organisation des rubriques dans `structure.js`.
Le guide complet est dans [docs/sanity.md](../docs/sanity.md).

Configurer `.env.local` d’après `.env.example` avant de lancer le Studio.

```sh
# Depuis la racine du dépôt
node scripts/studio.cjs dev
```

Adresse : http://localhost:3333/studio/

Les jetons d’API privés appartiennent uniquement au serveur du site. Ne jamais les placer dans la configuration du Studio ou dans des variables `SANITY_STUDIO_*`.
