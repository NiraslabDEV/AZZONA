const { v4: uuidv4 } = require('uuid');

const today = new Date().toISOString().split('T')[0];

const reservations = [
  {
    id: uuidv4(),
    customer_name: 'Isabella Moreira',
    customer_email: 'isabella.m@email.com',
    customer_phone: '+258 84 123 4567',
    date: today,
    time: '19:30',
    guests: 4,
    notes: 'Gluten free, jantar de aniversário',
    status: 'confirmed',
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    customer_name: 'Carlos Dias',
    customer_email: 'carlos.d@email.com',
    customer_phone: '+258 82 555 6789',
    date: today,
    time: '20:00',
    guests: 2,
    notes: '',
    status: 'pending',
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    customer_name: 'Elena Silva',
    customer_email: 'elena.s@email.com',
    customer_phone: '+258 87 888 9012',
    date: today,
    time: '21:15',
    guests: 6,
    notes: '',
    status: 'pending',
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    customer_name: 'Marcos Vieira',
    customer_email: 'marcos.v@email.com',
    customer_phone: '+258 84 331 0000',
    date: today,
    time: '19:00',
    guests: 3,
    notes: 'Aniversário de casamento',
    status: 'confirmed',
    created_at: new Date().toISOString(),
  },
];

const settings = {
  booking_closed: false,
  absence_message: '',
  // Black Coffee artist — admin pode mudar pelo dashboard
  spotify_embed_url: 'https://open.spotify.com/embed/artist/3qm84nBOXUEQ2vnTfUTTFC?utm_source=generator&theme=0&autoplay=1',
};

module.exports = { reservations, settings };
