import seed from './configSeeds.js';

seed()
  .then(() => {
    console.log('Seed finalizado com sucesso.');
    process.exit(0);
  })
  .catch((e) => {
    console.error('Erro ao rodar o seed:', e);
    process.exit(1);
  });
