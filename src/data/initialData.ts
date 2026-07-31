import { UserProfile, ScheduleItem, JournalEntry } from '../types';
import { getTodayDateString } from '../utils/date';

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'user-main',
    name: 'Dhyon',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    description: 'Perfil de acompanhamento visual diário de Dhyon.'
  },
  {
    id: 'helper-main',
    name: 'Mooniy (Apoiadora / Cuidadora)',
    role: 'helper',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    pin: '1234',
    description: 'Mooniy - Apoiadora autorizada a cadastrar sites, remédios, médicos, músicas e recados.'
  }
];

const today = getTodayDateString();

export const INITIAL_SCHEDULE_ITEMS: ScheduleItem[] = [
  {
    id: 'item-1',
    title: 'Tomar Remédio da Manhã',
    description: 'Remédio diário com água logo após o café da manhã.',
    medicalNote: '1 Comprimido azul de 10mg + 1 copo de água mineral',
    category: 'medication',
    date: today,
    startTime: '08:00',
    endTime: '08:15',
    completed: true,
    completedAt: '08:05',
    createdBy: 'Mooniy (Apoiadora)',
    createdByRole: 'helper',
    createdAt: new Date().toISOString(),
    important: true,
    recurring: 'daily',
    colorTag: 'emerald'
  },
  {
    id: 'item-2',
    title: 'Consulta Médica - Dr. Eduardo (Neurologista)',
    description: 'Consulta de acompanhamento e revisão da rotina médica no Centro de Saúde.',
    medicalNote: 'Levar a lista de horários dos remédios e receita antiga. Mooniy vai junto com você.',
    category: 'medical',
    date: today,
    startTime: '14:00',
    endTime: '15:00',
    completed: false,
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
    linkUrl: 'https://maps.google.com',
    createdBy: 'Mooniy (Apoiadora)',
    createdByRole: 'helper',
    createdAt: new Date().toISOString(),
    important: true,
    recurring: 'none',
    colorTag: 'blue'
  },
  {
    id: 'item-3',
    title: 'Ouvir Música Calma de Relaxamento',
    description: 'Momento para descansar os sentidos com sons da natureza e músicas suaves.',
    category: 'music',
    date: today,
    startTime: '15:30',
    endTime: '16:00',
    completed: false,
    musicUrl: 'https://www.youtube.com/watch?v=mPZkdNF6a20',
    imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80',
    createdBy: 'Mooniy (Apoiadora)',
    createdByRole: 'helper',
    createdAt: new Date().toISOString(),
    important: false,
    colorTag: 'purple'
  },
  {
    id: 'item-4',
    title: 'Acessar Site de Ciência e Natureza',
    description: 'Site legal com fotos calmas de animais e plantas para ler com calma.',
    category: 'website',
    date: today,
    startTime: '16:30',
    endTime: '17:00',
    completed: false,
    linkUrl: 'https://www.nationalgeographic.com',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80',
    createdBy: 'Mooniy (Apoiadora)',
    createdByRole: 'helper',
    createdAt: new Date().toISOString(),
    important: false,
    colorTag: 'amber'
  },
  {
    id: 'item-5',
    title: 'Tomar Remédio da Noite',
    description: 'Remédio para dormir com calma.',
    medicalNote: 'Tomar 15 gotas de remédio com chá morno.',
    category: 'medication',
    date: today,
    startTime: '20:00',
    endTime: '20:15',
    completed: false,
    createdBy: 'Mooniy (Apoiadora)',
    createdByRole: 'helper',
    createdAt: new Date().toISOString(),
    important: true,
    recurring: 'daily',
    colorTag: 'indigo'
  },
  {
    id: 'item-6',
    title: 'Nosso Passeio ao Pôr do Sol',
    description: 'Lembrança linda do nosso passeio calmo à beira da praia! Mooniy guardou essa foto com muito carinho.',
    category: 'image_note',
    date: today,
    startTime: '17:30',
    endTime: '18:00',
    completed: true,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    createdBy: 'Mooniy (Apoiadora)',
    createdByRole: 'helper',
    createdAt: new Date().toISOString(),
    important: true,
    colorTag: 'rose'
  },
  {
    id: 'item-7',
    title: 'Tarde Gostosa de Café & Conversas',
    description: 'Um momento de pausa e sorrisos. Dhyon tomando seu café preferido com a Mooniy.',
    category: 'image_note',
    date: today,
    startTime: '15:30',
    endTime: '16:00',
    completed: true,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    createdBy: 'Mooniy (Apoiadora)',
    createdByRole: 'helper',
    createdAt: new Date().toISOString(),
    important: false,
    colorTag: 'amber'
  },
  {
    id: 'item-8',
    title: 'Recado de Carinho no Jardim',
    description: 'Você é muito forte e especial, Dhyon! Lembre-se sempre do quanto você é amado e apoiado.',
    category: 'image_note',
    date: today,
    startTime: '11:00',
    endTime: '11:30',
    completed: true,
    imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
    createdBy: 'Mooniy (Apoiadora)',
    createdByRole: 'helper',
    createdAt: new Date().toISOString(),
    important: true,
    colorTag: 'emerald'
  }
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'journal-1',
    authorType: 'caregiver_to_user',
    authorName: 'Mooniy (Apoiadora / Cuidadora)',
    authorRole: 'helper',
    title: 'O que espero de você hoje (Orientações da Cuidadora)',
    content: 'Olá Dhyon! Hoje temos um dia mais calmo. Espero que você tome bastante água, tome o remédio da manhã com calma após o café e descanse bastante à tarde antes da consulta com o Dr. Eduardo. Se sentir qualquer incômodo ou cansaço excessivo, pode me avisar ou deixar um recadinho aqui no diário!',
    date: today,
    time: '07:30',
    expectationsTag: 'Expectativa da Cuidadora',
    feelingMood: 'calm',
    readByOther: false,
    replies: [
      {
        id: 'reply-1',
        authorName: 'Dhyon',
        authorRole: 'user',
        text: 'Obrigado Mooniy! Já tomei a água e o remédio das 08:00.',
        createdAt: '08:10'
      }
    ]
  },
  {
    id: 'journal-2',
    authorType: 'user_to_caregiver',
    authorName: 'Dhyon (Usuário)',
    authorRole: 'user',
    title: 'Meu Diário: Como estou me sentindo nesta manhã',
    content: 'Acordei me sentindo bem e tranquilo. Gostei muito da música de passarinhos que ouvimos ontem. Hoje estou ansioso apenas para saber o resultado dos exames na consulta de tarde, mas estou acompanhando a rotina certinho com a Mooniy.',
    date: today,
    time: '09:15',
    expectationsTag: 'Sentimentos do Usuário',
    feelingMood: 'happy',
    readByOther: true,
    replies: [
      {
        id: 'reply-2',
        authorName: 'Mooniy (Apoiadora / Cuidadora)',
        authorRole: 'helper',
        text: 'Fico muito feliz em saber! Não se preocupe com a consulta, vai dar tudo certo e estarei ao seu lado.',
        createdAt: '09:30'
      }
    ]
  },
  {
    id: 'journal-3',
    authorType: 'caregiver_to_user',
    authorName: 'Mooniy (Apoiadora / Cuidadora)',
    authorRole: 'helper',
    title: 'Dica da Semana: Pausa para respiração',
    content: 'Sempre que os barulhos da rua estiverem incomodando, Dhyon, lembre-se de usar os fones de ouvido e colocar a playlist de Músicas Calmas na aba de Sons. Isso ajuda seu cérebro a relaxar rapidamente.',
    date: today,
    time: '10:00',
    expectationsTag: 'Dica & Bem-Estar',
    feelingMood: 'calm',
    readByOther: false,
    replies: []
  }
];

