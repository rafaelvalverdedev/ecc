import { faker } from "@faker-js/faker";

// fetch nativo no Node 18+
const BASE_URL = "http://localhost:3001";

/* -----------------------------------
   Função auxiliar para requests
----------------------------------- */
async function request(method, endpoint, data = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" }
  };

  if (data) options.body = JSON.stringify(data);

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("❌ ERRO:", method, endpoint, body);
    throw new Error(JSON.stringify(body));
  }

  console.log(`✔ ${method} ${endpoint}`);
  return body;
}

/* -----------------------------------
   SEED
----------------------------------- */
async function runSeed() {
  console.log("\n🌱 INICIANDO SEED DO ECC...\n");

  /* -----------------------------------
     0) APAGAR TUDO (truncate)
  ----------------------------------- */
  await request("DELETE", "/dev/reset"); 
  // Você ainda NÃO tem essa rota. 
  // Vou criar ela depois, veja nota ao final.


  /* -----------------------------------
     1) CRIAR COORDENADORES (10)
  ----------------------------------- */
  console.log("\n📌 Criando coordenadores...");
  const coordenadores = [];

  for (let i = 0; i < 10; i++) {
    const pessoa = await request("POST", "/pessoas", {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      telefone: faker.phone.number()
    });

    coordenadores.push(pessoa);
  }

  /* -----------------------------------
     2) CRIAR EQUIPES (20)
  ----------------------------------- */
  console.log("\n📌 Criando equipes...");
  const equipes = [];

  for (let i = 0; i < 20; i++) {
    const equipe = await request("POST", "/equipes", {
      nome: `Equipe ${faker.word.adjective()} ${i + 1}`,
      descricao: faker.lorem.sentence()
    });

    equipes.push(equipe);
  }

  /* -----------------------------------
     3) Definir coordenador líder por equipe
  ----------------------------------- */
  console.log("\n📌 Atribuindo coordenadores às equipes...");

  for (let equipe of equipes) {
    const coordenador = faker.helpers.arrayElement(coordenadores);

    await request("POST", "/teamrole", {
      pessoa_id: coordenador.id,
      equipe_id: equipe.id,
      is_leader: true
    });
  }

  /* -----------------------------------
     4) Criar 200 ENCONTREIROS e distribuí-los nas equipes
  ----------------------------------- */
  console.log("\n📌 Criando 200 encontreiros...");

  const encontreiros = [];

  for (let i = 0; i < 200; i++) {
    const pessoa = await request("POST", "/pessoas", {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      telefone: faker.phone.number()
    });

    encontreiros.push(pessoa);

    // Adicionar na equipe aleatória
    const equipeRandom = faker.helpers.arrayElement(equipes);

    await request("POST", "/teamrole", {
      pessoa_id: pessoa.id,
      equipe_id: equipeRandom.id,
      is_leader: false
    });
  }

  /* -----------------------------------
     5) Criar evento único
  ----------------------------------- */
  console.log("\n📌 Criando evento principal...");

  const evento = await request("POST", "/eventos", {
    nome: "ECC Geral 2025",
    descricao: "Grande encontro ECC 2025",
    local: "Centro de Eventos São José",
    start_date: "2025-09-01",
    end_date: "2025-09-03",
    capacity: 200
  });

  /* -----------------------------------
     6) Criar momentos automáticos
  ----------------------------------- */
  console.log("\n📌 Criando momentos do evento...");

  const momentosPadrao = [
    "Abertura",
    "Louvor",
    "Palestra 1",
    "Momento Casais",
    "Intervalo",
    "Palestra 2",
    "Dinâmica",
    "Jantar",
    "Encerramento"
  ];

  let ordem = 1;

  for (let nomeMomento of momentosPadrao) {
    await request("POST", "/momentos", {
      evento_id: evento.id,
      equipe_id: faker.helpers.arrayElement(equipes).id,
      titulo: nomeMomento,
      descricao: faker.lorem.sentence(),
      start_time: `2025-09-01 0${ordem}:00:00`,
      end_time: `2025-09-01 0${ordem}:30:00`,
      ordem: ordem++
    });
  }

  /* -----------------------------------
     7) Criar 100 ENCONTRISTAS + inscrições
  ----------------------------------- */
  console.log("\n📌 Criando 100 encontristas...");
  const encontristas = [];

  for (let i = 0; i < 100; i++) {
    const pessoa = await request("POST", "/pessoas", {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      telefone: faker.phone.number()
    });

    encontristas.push(pessoa);

    const inscricao = await request("POST", "/inscricoes", {
      evento_id: evento.id,
      pessoa_id: pessoa.id
    });

    // Sorteia 70% dos casos como pagos
    const shouldPay = Math.random() < 0.7;

    if (shouldPay) {
      const pagante = faker.helpers.arrayElement([...coordenadores, ...encontreiros]);

      await request("PATCH", `/inscricoes/${inscricao.id}/pagamento`, {
        paid_by_pessoa_id: pagante.id
      });
    }
  }

  console.log("\n🌱 SEED COMPLETO COM SUCESSO! 🎉\n");
}

runSeed().catch((err) => {
  console.error("\n💥 Erro no seed:\n", err);
  process.exit(1);
});
