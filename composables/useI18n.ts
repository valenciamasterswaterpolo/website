import { ref, computed } from 'vue'

type Language = 'es' | 'en'

const getDefaultLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const browserLang = navigator.language || (navigator as any).userLanguage || ''
    return browserLang.toLowerCase().startsWith('es') ? 'es' : 'en'
  }
  return 'en'
}

const currentLanguage = ref<Language>(getDefaultLanguage())

const translations = {
  es: {
    // Navigation
    nav: {
      about: 'Qué es',
      schedule: 'Calendario',
      format: 'Formato',
      why: 'Por qué',
      teams: 'Equipos',
      valencia: 'Valencia',
      stats: 'Edición anterior',
      registration: 'Inscripción',
      faq: 'FAQ',
      contact: 'Contacto',
      preRegister: 'Pre-inscripción'
    },

    // Hero
    hero: {
      subtitle: 'III Torneo Máster · UPV Campus, Valencia',
      dates: '16-17 Mayo 2026',
      cta: 'Pre-inscripción',
      scroll: 'Scroll para descubrir'
    },

    // About section
    about: {
      title: '¿Qué es la Valencia Masters Water Polo Cup?',
      description: 'Torneo de waterpolo máster celebrado en Valencia, pensado para equipos +30 que quieren competir en serio y disfrutar aún más fuera del agua.',
      features: [
        { title: 'Ambiente Internacional', description: 'Equipos de diferentes países compitiendo juntos' },
        { title: 'Espíritu Máster', description: 'Deporte, compañerismo y tercera parte' },
        { title: 'Sede UPV', description: 'Piscina del campus de la Universidad Politécnica de Valencia' }
      ]
    },

    // Schedule section
    schedule: {
      title: 'Categoría, fechas y horario',
      category: {
        label: 'Categoría',
        value: 'Máster mixto +30'
      },
      dates: {
        label: 'Fechas',
        value: '16 y 17 de mayo de 2026'
      },
      times: {
        label: 'Horario',
        saturday: 'Sábado: 15:00–21:00',
        sunday: 'Domingo: 09:00–15:00'
      },
      location: {
        label: 'Ubicación',
        value: 'Piscina · Campus UPV, Valencia'
      }
    },

    // Format section
    format: {
      title: 'Formato del torneo',
      items: [
        { key: 'fields', text: '2 campos simultáneos', icon: 'fields' },
        { key: 'duration', text: '13 min por partido', icon: 'clock' },
        { key: 'stages', text: 'Grupos + eliminatorias', icon: 'bracket' },
        { key: 'scoring', text: 'Victoria 3 pts · Derrota 0', icon: 'score' },
        { key: 'penalties', text: 'Empate = 3 penaltis', icon: 'penalty' },
        { key: 'trophies', text: 'Trofeos 1º, 2º + MVP', icon: 'trophy' }
      ]
    },

    // Why section
    why: {
      title: '¿Por qué jugar la Valencia Masters Water Polo Cup?',
      features: [
        { icon: 'video', title: 'Live Streaming', description: 'Todos los partidos retransmitidos en directo' },
        { icon: 'whistle', title: 'Árbitros en activo', description: 'Arbitraje profesional de calidad' },
        { icon: 'gift', title: 'Pack de bienvenida', description: 'Kit de bienvenida para todos los equipos' },
        { icon: 'dinner', title: 'Cena oficial', description: 'Cena del torneo y ambiente social' }
      ]
    },

    // Valencia section
    valencia: {
      title: 'Valencia, mucho más que piscina',
      features: [
        { icon: 'beach', title: 'Mediterráneo', description: 'Playa y buen clima todo el año' },
        { icon: 'food', title: 'Gastronomía', description: 'Paella y cocina local' },
        { icon: 'arts', title: 'Ciudad de las Artes', description: 'Ciudad de las Artes y las Ciencias' },
        { icon: 'nightlife', title: 'Vida nocturna', description: 'Centro histórico y ambiente' }
      ]
    },

    // Stats section
    stats: {
      title: 'La última edición en cifras',
      items: [
        { number: '14', label: 'Equipos' },
        { number: '200+', label: 'Jugadores' },
        { number: '+60%', label: 'Internacional' }
      ]
    },

    // Registration section
    registration: {
      title: 'Inscripción de equipos',
      fee: {
        label: 'Cuota',
        value: '250 €*',
        per: 'por equipo',
        note: '*Cena oficial no incluida'
      },
      players: {
        label: 'Jugadores',
        value: 'Hasta 16 jugadores incluidos'
      },
      extra: {
        label: 'Suplemento',
        value: 'Para plantillas superiores a 16 jugadores'
      },
      cta: 'Pre-inscripción'
    },

    // Contact section
    contact: {
      title: 'Contacto y redes',
      email: 'info@valenciamasterswaterpolo.com',
      web: 'valenciamasterswaterpolo.com',
      instagram: 'ValenciaMastersWaterpolo',
      youtube: '@ValenciaMastersWaterPoloCup',
      closing: '¿Preparados para la próxima edición?'
    },

    // Pre-registration modal
    modal: {
      title: 'Pre-inscripción',
      subtitle: 'Reserva tu plaza para la Valencia Masters Water Polo Cup 2026',
      fields: {
        teamName: 'Nombre del equipo',
        contactName: 'Nombre de contacto',
        email: 'Email',
        phone: 'Teléfono',
        phoneHelper: 'Usaremos este número para añadirte al grupo de WhatsApp y darte más información sobre la copa si tu equipo es seleccionado.',
        country: 'País',
        players: 'Número de jugadores estimado'
      },
      submit: 'Enviar pre-inscripción',
      success: '¡Gracias! Hemos recibido tu pre-inscripción.',
      error: 'Error al enviar. Por favor, inténtalo de nuevo.',
      whatsappTitle: '¡Únete a nuestra comunidad!',
      whatsappText: 'Recibe novedades y actualizaciones del torneo',
      whatsappButton: 'Unirse al grupo de WhatsApp'
    },

    // Sponsors section
    sponsors: {
      title: 'Con el apoyo de',
      cta: '¿Quieres ser patrocinador?'
    },

    // Teams section
    teams: {
      title: 'Equipos Participantes',
      description: 'Conoce a los equipos que competirán en la Valencia Masters Water Polo Cup 2026'
    },

    // FAQ section
    faq: {
      title: 'Preguntas Frecuentes',
      items: [
        {
          question: '¿Cómo puedo inscribir a mi equipo?',
          answer: 'Rellena el formulario de pre-inscripción en esta web. Nos pondremos en contacto contigo para confirmar tu plaza y enviarte los detalles de pago.'
        },
        {
          question: '¿Cuál es la fecha límite de inscripción?',
          answer: 'Las inscripciones cierran el 15 de abril de 2026 o cuando se complete el cupo de equipos disponible.'
        },
        {
          question: '¿Qué incluye la cuota de inscripción?',
          answer: 'La cuota incluye la participación en el torneo, pack de bienvenida para el equipo, acceso a vestuarios y zonas comunes, y trofeos para los ganadores. La cena oficial se paga aparte.'
        },
        {
          question: '¿Cuántos jugadores puede tener mi equipo?',
          answer: 'La cuota base incluye hasta 16 jugadores. Si tu plantilla es mayor, hay un pequeño suplemento por jugador adicional.'
        },
        {
          question: '¿Cómo contacto con la organización?',
          answer: 'Puedes escribirnos a info@valenciamasterswaterpolo.com o seguirnos en nuestras redes sociales para estar al día de todas las novedades.'
        }
      ],
      moreQuestions: '¿Tienes más preguntas?',
      contactUs: 'Contáctanos'
    },

    // Footer
    footer: {
      rights: 'Todos los derechos reservados'
    }
  },

  en: {
    // Navigation
    nav: {
      about: 'About',
      schedule: 'Schedule',
      format: 'Format',
      why: 'Why',
      teams: 'Teams',
      valencia: 'Valencia',
      stats: 'Last Edition',
      registration: 'Registration',
      faq: 'FAQ',
      contact: 'Contact',
      preRegister: 'Pre-register'
    },

    // Hero
    hero: {
      subtitle: 'III Masters Tournament · UPV Campus, Valencia',
      dates: '16-17 May 2026',
      cta: 'Pre-register',
      scroll: 'Scroll to discover'
    },

    // About section
    about: {
      title: 'What is the Valencia Masters Water Polo Cup?',
      description: 'A masters water polo tournament in Valencia for 30+ teams that want serious competition and even better vibes outside the pool.',
      features: [
        { title: 'International Atmosphere', description: 'Teams from different countries competing together' },
        { title: 'Masters Spirit', description: 'Sport, friendship and "third half"' },
        { title: 'UPV Venue', description: 'Swimming pool at the Polytechnic University of Valencia campus' }
      ]
    },

    // Schedule section
    schedule: {
      title: 'Category, dates & schedule',
      category: {
        label: 'Category',
        value: 'Mixed Masters +30'
      },
      dates: {
        label: 'Dates',
        value: '16 & 17 May 2026'
      },
      times: {
        label: 'Schedule',
        saturday: 'Saturday: 15:00–21:00',
        sunday: 'Sunday: 09:00–15:00'
      },
      location: {
        label: 'Location',
        value: 'Swimming pool · UPV Campus, Valencia'
      }
    },

    // Format section
    format: {
      title: 'Tournament format',
      items: [
        { key: 'fields', text: '2 simultaneous fields', icon: 'fields' },
        { key: 'duration', text: '13 min per game', icon: 'clock' },
        { key: 'stages', text: 'Groups + knockouts', icon: 'bracket' },
        { key: 'scoring', text: 'Win 3 pts · Loss 0', icon: 'score' },
        { key: 'penalties', text: 'Draw = 3 penalties', icon: 'penalty' },
        { key: 'trophies', text: 'Trophies 1st, 2nd + MVP', icon: 'trophy' }
      ]
    },

    // Why section
    why: {
      title: 'Why play the Valencia Masters Water Polo Cup?',
      features: [
        { icon: 'video', title: 'Live Streaming', description: 'All games streamed live' },
        { icon: 'whistle', title: 'Active Referees', description: 'Quality professional refereeing' },
        { icon: 'gift', title: 'Welcome Pack', description: 'Welcome kit for all teams' },
        { icon: 'dinner', title: 'Official Dinner', description: 'Tournament dinner and social atmosphere' }
      ]
    },

    // Valencia section
    valencia: {
      title: 'Valencia, more than just the pool',
      features: [
        { icon: 'beach', title: 'Mediterranean', description: 'Beach and great weather year-round' },
        { icon: 'food', title: 'Gastronomy', description: 'Paella and local cuisine' },
        { icon: 'arts', title: 'City of Arts', description: 'City of Arts and Sciences' },
        { icon: 'nightlife', title: 'Nightlife', description: 'Historic centre and atmosphere' }
      ]
    },

    // Stats section
    stats: {
      title: 'Last edition in numbers',
      items: [
        { number: '14', label: 'Teams' },
        { number: '200+', label: 'Players' },
        { number: '+60%', label: 'International' }
      ]
    },

    // Registration section
    registration: {
      title: 'Team registration',
      fee: {
        label: 'Fee',
        value: '250 €*',
        per: 'per team',
        note: '*Official dinner not included'
      },
      players: {
        label: 'Players',
        value: 'Up to 16 players included'
      },
      extra: {
        label: 'Extra',
        value: 'Extra fee for rosters with more than 16 players'
      },
      cta: 'Pre-register'
    },

    // Contact section
    contact: {
      title: 'Contact & socials',
      email: 'info@valenciamasterswaterpolo.com',
      web: 'valenciamasterswaterpolo.com',
      instagram: 'ValenciaMastersWaterpolo',
      youtube: '@ValenciaMastersWaterPoloCup',
      closing: 'Ready for the next edition?'
    },

    // Pre-registration modal
    modal: {
      title: 'Pre-registration',
      subtitle: 'Reserve your spot for the Valencia Masters Water Polo Cup 2026',
      fields: {
        teamName: 'Team name',
        contactName: 'Contact name',
        email: 'Email',
        phone: 'Phone',
        phoneHelper: 'We will use this number to add you to the WhatsApp group and provide further information about the cup if your team is selected.',
        country: 'Country',
        players: 'Estimated number of players'
      },
      submit: 'Submit pre-registration',
      success: 'Thank you! We have received your pre-registration.',
      error: 'Error sending. Please try again.',
      whatsappTitle: 'Join our community!',
      whatsappText: 'Get tournament news and updates',
      whatsappButton: 'Join WhatsApp group'
    },

    // Sponsors section
    sponsors: {
      title: 'Supported by',
      cta: 'Want to become a sponsor?'
    },

    // Teams section
    teams: {
      title: 'Participating Teams',
      description: 'Meet the teams competing in the Valencia Masters Water Polo Cup 2026'
    },

    // FAQ section
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'How can I register my team?',
          answer: 'Fill out the pre-registration form on this website. We will contact you to confirm your spot and send you payment details.'
        },
        {
          question: 'What is the registration deadline?',
          answer: 'Registration closes on April 15, 2026 or when all available team spots are filled.'
        },
        {
          question: 'What does the registration fee include?',
          answer: 'The fee includes tournament participation, welcome pack for the team, access to changing rooms and common areas, and trophies for winners. The official dinner is paid separately.'
        },
        {
          question: 'How many players can my team have?',
          answer: 'The base fee includes up to 16 players. If your roster is larger, there is a small extra fee per additional player.'
        },
        {
          question: 'How do I contact the organizers?',
          answer: 'You can email us at info@valenciamasterswaterpolo.com or follow us on social media to stay updated with all the news.'
        }
      ],
      moreQuestions: 'Have more questions?',
      contactUs: 'Contact us'
    },

    // Footer
    footer: {
      rights: 'All rights reserved'
    }
  }
}

export function useI18n() {
  const setLanguage = (lang: Language) => {
    currentLanguage.value = lang
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
    }
  }

  const toggleLanguage = () => {
    setLanguage(currentLanguage.value === 'es' ? 'en' : 'es')
  }

  const initLanguage = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language') as Language | null
      if (saved && (saved === 'es' || saved === 'en')) {
        currentLanguage.value = saved
      } else {
        // Auto-detect from browser language
        currentLanguage.value = getDefaultLanguage()
      }
    }
  }

  const t = computed(() => translations[currentLanguage.value])

  return {
    currentLanguage,
    setLanguage,
    toggleLanguage,
    initLanguage,
    t
  }
}
