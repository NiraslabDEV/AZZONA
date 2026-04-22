const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

// In-memory store until PostgreSQL is wired (Sprint 2)
const dishes = [
  { id: '1',  name: 'Filé Grelhado Premium',    description: 'Corte nobre com purê trufado, brócolis e jus de carne',             price: 1200, category: 'Grelhados',     image_url: '/img/484804359_1260022132502225_9002357013459047453_n.jpg',  available: true },
  { id: '2',  name: 'Costeletas de Cordeiro',    description: 'Rack premium com legumes baby e molho de vinho tinto',               price: 1800, category: 'Grelhados',     image_url: '/img/484457645_1257209296116842_4180192928181874170_n.jpg',  available: true },
  { id: '3',  name: 'Steak Microgreens',         description: 'Filé suculento com molho mostarda, microgreens e legumes da estação', price: 1600, category: 'Grelhados',     image_url: '/img/484913423_1262837595554012_1331087500422327570_n.jpg',  available: true },
  { id: '4',  name: 'Espetada Especial',         description: 'Espetada marinada com arroz frito de legumes e ervas frescas',        price: 1300, category: 'Grelhados',     image_url: '/img/487126723_1269279344909837_4476153206961834787_n.jpg',  available: true },
  { id: '5',  name: 'Camarão à Azzona',          description: 'Camarão grelhado com micro-ervas, azeite aromático e brunoise',       price: 1500, category: 'Mariscos',      image_url: '/img/484820956_1261957092308729_1428777494545251595_n.jpg',  available: true },
  { id: '6',  name: 'Camarão Wok Asiático',      description: 'Salteado com legumes asiáticos, sésamo e coentros frescos',           price: 1400, category: 'Mariscos',      image_url: '/img/485004961_1263257902178648_6284640658343000025_n.jpg',  available: true },
  { id: '7',  name: 'Peixe do Dia',             description: 'Peixe grelhado com purê de legumes e molho de ervas frescas',         price: 1100, category: 'Mariscos',      image_url: '/img/485179218_1263252648845840_4921845530168055651_n.jpg',  available: true },
  { id: '8',  name: 'Frango com Purê',           description: 'Peito suculento com vegetais grelhados e molho especial da casa',     price:  950, category: 'Internacional',  image_url: '/img/482225429_1257229656114806_8061117193943724354_n.jpg',  available: true },
  { id: '9',  name: 'Almôndegas Rústicas',       description: 'Almôndegas artesanais em molho de tomate especial com esparguete',    price:  900, category: 'Internacional',  image_url: '/img/482980454_1257229869448118_4022944273589845584_n.jpg',  available: true },
  { id: '10', name: 'Porco Glaceado',            description: 'Barriga de porco caramelizada com arroz selvagem e espinafre',        price: 1350, category: 'Internacional',  image_url: '/img/487201664_1271967264641045_1331682163481026793_n.jpg',  available: true },
  { id: '11', name: 'Caril Tradicional',         description: 'Receita local com arroz basmati e acompanhamentos da casa',           price:  850, category: 'Comfort Food',   image_url: '/img/487296556_1271956371308801_3061308100768747555_n.jpg',  available: true },
  { id: '12', name: 'Brunch Bowl Azzona',        description: 'Batatas temperadas, salada fresca, ovo estrelado e tempero caseiro',  price:  750, category: 'Breakfood',      image_url: '/img/485694368_1262845265553245_3561934188606388695_n.jpg',  available: true },
  { id: '13', name: 'Cocktail de Assinatura',    description: 'Criações exclusivas com frutas tropicais de Moçambique',             price:  450, category: 'Cocktails',      image_url: '/img/00b60c2b-3c28-41c2-8202-af22d6f4cf57.jfif',           available: true },
  { id: '14', name: 'Frango Roulade',            description: 'Frango recheado em ratatouille, arroz branco e molho cremoso',       price: 1050, category: 'Internacional',  image_url: '/img/485767518_1265843485253423_3738915977701527549_n.jpg',  available: true },
  { id: '15', name: 'Perna de Porco Brasada',    description: 'Cozimento lento com purê de batata-doce, coleslaw e molho agridoce', price: 1600, category: 'Internacional',  image_url: '/img/487298089_1270040958167009_7860175887240317597_n.jpg',  available: true },
  { id: '16', name: 'Steak no Tacho',            description: 'Filé em tacho com legumes assados, arroz e creme de ervas',          price: 1700, category: 'Grelhados',     image_url: '/img/484551707_1263958648775240_3132819095349472957_n.jpg',  available: true },
];

router.get('/', limiter, (req, res) => {
  const { category } = req.query;
  let result = dishes.filter(d => d.available);
  if (category && category !== 'all') {
    result = result.filter(d => d.category === category);
  }
  res.json(result);
});

module.exports = router;
