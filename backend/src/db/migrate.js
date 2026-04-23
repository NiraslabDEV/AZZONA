const pool = require('./index');

const DISHES_SEED = [
  { id: '00000001-0000-0000-0000-000000000001', name: 'Filé Grelhado Premium',    description: 'Corte nobre com purê trufado, brócolis e jus de carne',             price: 1200, category: 'Grelhados',     image_url: '/img/484804359_1260022132502225_9002357013459047453_n.jpg' },
  { id: '00000001-0000-0000-0000-000000000002', name: 'Costeletas de Cordeiro',    description: 'Rack premium com legumes baby e molho de vinho tinto',               price: 1800, category: 'Grelhados',     image_url: '/img/484457645_1257209296116842_4180192928181874170_n.jpg' },
  { id: '00000001-0000-0000-0000-000000000003', name: 'Steak Microgreens',         description: 'Filé suculento com molho mostarda, microgreens e legumes da estação', price: 1600, category: 'Grelhados',     image_url: '/img/484913423_1262837595554012_1331087500422327570_n.jpg' },
  { id: '00000001-0000-0000-0000-000000000004', name: 'Espetada Especial',         description: 'Espetada marinada com arroz frito de legumes e ervas frescas',        price: 1300, category: 'Grelhados',     image_url: '/img/487126723_1269279344909837_4476153206961834787_n.jpg' },
  { id: '00000001-0000-0000-0000-000000000005', name: 'Camarão à Azzona',          description: 'Camarão grelhado com micro-ervas, azeite aromático e brunoise',       price: 1500, category: 'Mariscos',      image_url: '/img/484820956_1261957092308729_1428777494545251595_n.jpg' },
  { id: '00000001-0000-0000-0000-000000000006', name: 'Camarão Wok Asiático',      description: 'Salteado com legumes asiáticos, sésamo e coentros frescos',           price: 1400, category: 'Mariscos',      image_url: '/img/485004961_1263257902178648_6284640658343000025_n.jpg' },
  { id: '00000001-0000-0000-0000-000000000007', name: 'Peixe do Dia',              description: 'Peixe grelhado com purê de legumes e molho de ervas frescas',         price: 1100, category: 'Mariscos',      image_url: '/img/485179218_1263252648845840_4921845530168055651_n.jpg' },
  { id: '00000001-0000-0000-0000-000000000008', name: 'Frango com Purê',           description: 'Peito suculento com vegetais grelhados e molho especial da casa',     price:  950, category: 'Internacional',  image_url: '/img/482225429_1257229656114806_8061117193943724354_n.jpg' },
  { id: '00000001-0000-0000-0000-000000000009', name: 'Almôndegas Rústicas',       description: 'Almôndegas artesanais em molho de tomate especial com esparguete',    price:  900, category: 'Internacional',  image_url: '/img/482980454_1257229869448118_4022944273589845584_n.jpg' },
  { id: '00000001-0000-0000-0000-000000000010', name: 'Porco Glaceado',            description: 'Barriga de porco caramelizada com arroz selvagem e espinafre',        price: 1350, category: 'Internacional',  image_url: '/img/487201664_1271967264641045_1331682163481026793_n.jpg' },
  { id: '00000001-0000-0000-0000-000000000011', name: 'Caril Tradicional',         description: 'Receita local com arroz basmati e acompanhamentos da casa',           price:  850, category: 'Comfort Food',   image_url: '/img/487296556_1271956371308801_3061308100768747555_n.jpg' },
  { id: '00000001-0000-0000-0000-000000000012', name: 'Brunch Bowl Azzona',        description: 'Batatas temperadas, salada fresca, ovo estrelado e tempero caseiro',  price:  750, category: 'Breakfood',      image_url: '/img/485694368_1262845265553245_3561934188606388695_n.jpg' },
  { id: '00000001-0000-0000-0000-000000000013', name: 'Cocktail de Assinatura',    description: 'Criações exclusivas com frutas tropicais de Moçambique',             price:  450, category: 'Cocktails',      image_url: '/img/00b60c2b-3c28-41c2-8202-af22d6f4cf57.jfif'           },
  { id: '00000001-0000-0000-0000-000000000014', name: 'Frango Roulade',            description: 'Frango recheado em ratatouille, arroz branco e molho cremoso',       price: 1050, category: 'Internacional',  image_url: '/img/485767518_1265843485253423_3738915977701527549_n.jpg' },
  { id: '00000001-0000-0000-0000-000000000015', name: 'Perna de Porco Brasada',    description: 'Cozimento lento com purê de batata-doce, coleslaw e molho agridoce', price: 1600, category: 'Internacional',  image_url: '/img/487298089_1270040958167009_7860175887240317597_n.jpg' },
  { id: '00000001-0000-0000-0000-000000000016', name: 'Steak no Tacho',            description: 'Filé em tacho com legumes assados, arroz e creme de ervas',          price: 1700, category: 'Grelhados',     image_url: '/img/484551707_1263958648775240_3132819095349472957_n.jpg' },
];

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reservations (
      id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_name  VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(50)  NOT NULL,
      date        DATE         NOT NULL,
      "time"      VARCHAR(10)  NOT NULL,
      guests      INTEGER      NOT NULL,
      notes       TEXT         NOT NULL DEFAULT '',
      status      VARCHAR(20)  NOT NULL DEFAULT 'pending',
      created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ
    );

    CREATE TABLE IF NOT EXISTS settings (
      key   VARCHAR(100) PRIMARY KEY,
      value TEXT         NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS dishes (
      id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
      name        VARCHAR(255) NOT NULL,
      description TEXT         NOT NULL DEFAULT '',
      price       NUMERIC(10,2) NOT NULL,
      category    VARCHAR(100) NOT NULL,
      image_url   TEXT         NOT NULL DEFAULT '',
      available   BOOLEAN      NOT NULL DEFAULT true,
      created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ
    );

    CREATE TABLE IF NOT EXISTS events (
      id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
      dj_name     VARCHAR(255) NOT NULL,
      date        DATE         NOT NULL,
      description TEXT         NOT NULL DEFAULT '',
      image_url   TEXT,
      is_active   BOOLEAN      NOT NULL DEFAULT false,
      created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    );
  `);

  // Seed default settings (idempotent)
  await pool.query(`
    INSERT INTO settings (key, value) VALUES
      ('booking_closed',  'false'),
      ('absence_message', ''),
      ('spotify_embed_url', 'https://open.spotify.com/embed/artist/3qm84nBOXUEQ2vnTfUTTFC?utm_source=generator&theme=0&autoplay=1')
    ON CONFLICT (key) DO NOTHING
  `);

  // Seed dishes if table is empty
  const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM dishes');
  if (rows[0].n === 0) {
    for (const d of DISHES_SEED) {
      await pool.query(
        `INSERT INTO dishes (id, name, description, price, category, image_url, available)
         VALUES ($1,$2,$3,$4,$5,$6,true) ON CONFLICT (id) DO NOTHING`,
        [d.id, d.name, d.description, d.price, d.category, d.image_url]
      );
    }
  }
}

module.exports = migrate;
