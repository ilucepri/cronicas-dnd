// -----------------------------------------------------------------------------
// Configuración curada de las campañas.
//
// Las SESIONES se importan automáticamente del vault de Obsidian (ver
// scripts/import-obsidian.mjs). Lo de aquí es lo editorial: qué campañas
// existen, cómo se agrupan las sesiones en arcos, y las fichas de personajes y
// de mundo. Edita este archivo y vuelve a lanzar `npm run import`.
// -----------------------------------------------------------------------------

// Todas las campañas del selector. `vault` es la carpeta dentro de
// `Historias/`; si es null, la campaña sale como "sin notas todavía".
export const campaigns = [
  {
    id: 'oro',
    name: 'Oro sobre Plata',
    subtitle: 'D&D 5e · Faerûn',
    party: 'La Compañía del Oso',
    hashtag: 'OroSobrePlata',
    vault: 'Oro sobre Plata',
    footer: { line1: 'Nivel ~10 · rumbo al Anauroch' },
    intro:
      'Una crónica de dragones, no muertos e intrigas del norte de Faerûn. Más de noventa sesiones de un grupo que carga con fragmentos del Orbe dracónico y una deuda con Orcus.',
    heroKicker: 'La Compañía del Oso',
  },
  {
    id: 'strahd',
    name: 'Curse of Strahd',
    subtitle: 'D&D 5e · Barovia',
    party: 'El grupo',
    hashtag: 'CurseOfStrahd',
    vault: 'Curse of Strahd',
    footer: { line1: 'Terror gótico en Barovia' },
    intro:
      'Atrapados tras las brumas de Barovia, un grupo se enfrenta al vampiro Strahd von Zarovich. Terror gótico, tarot y viejas maldiciones.',
    heroKicker: 'Crónica de Barovia',
  },
  {
    id: 'saltmarsh',
    name: 'Fantasmas sobre Saltmarsh',
    subtitle: 'D&D 5e · Saltmarsh',
    party: 'El grupo',
    hashtag: 'FantasmasSobreSaltmarsh',
    vault: 'Fantasmas sobre Saltmarsh',
    footer: { line1: 'Contrabando y cultos marinos' },
    intro:
      'Contrabando, cultos marinos y presagios en el pueblo costero de Saltmarsh. Un grupo tira del hilo de la Sal Roja y del Fantasma del Mar.',
    heroKicker: 'Crónica de Saltmarsh',
  },
  {
    id: 'brujaluz',
    name: 'Brujaluz',
    subtitle: 'D&D 5e · Reino Feérico',
    party: 'La Hermandad de los Ecos Perdidos',
    hashtag: 'LasTierrasMasAllaDeBrujaluz',
    vault: 'The Wild Beyond Witchlight',
    footer: { line1: 'Guerra de guerrillas contra Skabatha' },
    intro:
      'Una feria mágica abre la puerta a Allende, el Reino Feérico. La Hermandad de los Ecos Perdidos rescata a los niños perdidos y planta cara a las brujas del bosque.',
    heroKicker: 'La Hermandad de los Ecos Perdidos',
  },
  {
    id: 'guardalumbre',
    name: 'Misterios de Guardalumbre',
    subtitle: 'D&D 5e · Guardalumbre',
    party: 'Los ojos de la Gorgona',
    hashtag: 'MisteriosDeGuardalumbre',
    vault: 'Guardalumbre',
    intro:
      'El brazo armado de la ciudad-biblioteca de Guardalumbre. Mercenarios al servicio de Los Ilustrados, metidos en una extraña investigación interna.',
    heroKicker: 'Los ojos de la Gorgona',
  },
  {
    id: 'librorojo',
    name: 'La conspiración del libro rojo',
    subtitle: 'D&D 5e',
    party: 'El grupo',
    hashtag: 'LaConspiracionDelLibroRojo',
    vault: 'La conspiración del libro rojo',
    intro: 'Una conspiración se teje alrededor de un libro rojo.',
    heroKicker: 'Crónica de campaña',
  },
]

// Arcos de Oro sobre Plata. El último (`to` alto) recoge las sesiones nuevas.
export const arcs = {
  oro: [
    { id: 'a1', roman: 'I', name: 'Bajo la Montaña', sub: 'El tumulario, Lunargentea y los primeros no muertos.', from: 1, to: 10 },
    { id: 'a2', roman: 'II', name: 'En la Infraoscuridad', sub: 'Chamanes, micónidos y los caminos de la izquierda.', from: 11, to: 20 },
    { id: 'a3', roman: 'III', name: 'El Ikea de Carne', sub: 'Orlbar, los ilícidos y la dragona con piel humana.', from: 21, to: 30 },
    { id: 'a4', roman: 'IV', name: 'Secretos y Susurros', sub: 'Maldiciones entre borrachos, la dragona y misiones peligrosas.', from: 31, to: 40 },
    { id: 'a5', roman: 'V', name: 'Tumularios', sub: 'Antiguas tumbas, viejos juramentos y no muertos.', from: 41, to: 50 },
    { id: 'a6', roman: 'VI', name: 'El Fin de Uthgar', sub: 'Drakhan, elegido; el campamento orco y el norte.', from: 51, to: 60 },
    { id: 'a7', roman: 'VII', name: 'Sangre del Norte', sub: 'Las tribus bárbaras, sus dioses y sus guerras.', from: 61, to: 70 },
    { id: 'a8', roman: 'VIII', name: 'Pacto con el Demonio', sub: 'Deudas con Orcus y el precio del poder.', from: 71, to: 80 },
    { id: 'a9', roman: 'IX', name: 'Rumbo al Anauroch', sub: 'Ghouls en Lunargentea y el desierto del rey dragón.', from: 81, to: 9999 },
  ],
}

const ACCENT = 'var(--color-accent-400)'
const NEUTRAL = 'var(--color-neutral-400)'

// La Compañía del Oso. `dot` colorea el punto en el aside y las fichas.
export const party = {
  oro: [
    {
      id: 'venti', name: 'Venti Fortunati', short: 'Bardo', tagline: 'Bardo tabaxi · La jugadora',
      img: 'campaigns/oro/portraits/venti.png',
      status: 'Portadora del Orbe', dot: ACCENT,
      blurb: [
        'Del clan Zarpa Negra, de Kara-Tur; se rumorea que su linaje llegó a gobernar Amn. Camada de tres, busca por toda la campaña a su hermano Corvo. Devota de Tymora, toca el shamisen y el baglamá.',
        'Carga con lo más pesado de la trama: porta dos fragmentos del Orbe dracónico, cada uno un tercio del alma de Malystryx, y ha sellado un pacto con Orcus. Fue amante de la dragona Ondrur, lo que le ha traído problemas. La acecha el Perdido Estelar del Reino Remoto.',
      ],
      facts: [
        { label: 'Raza', value: 'Tabaxi (clan Zarpa Negra)' },
        { label: 'Devoción', value: 'Tymora' },
        { label: 'Montura', value: 'Zephyr' },
        { label: 'Familiar', value: 'Fromaggio (rata)' },
      ],
    },
    {
      id: 'leia', name: 'Leia', short: 'Ranger', tagline: 'Ranger elfa · Altarraíz',
      img: 'campaigns/oro/portraits/leia.png',
      status: 'Salvar las marcas argénteas', dot: ACCENT,
      blurb: [
        'Del sur; huyó de su tribu. Su compañera animal es la osa Ursus y su arco está hecho con escamas de dragón. Entiende dracónico y tiene buen ojo para detectar no muertos.',
        'Hizo un pacto con las brujas del pantano que la enemistó con la Tribu del Grifo. Mantiene un romance con Yorus Mantoazur, en Lunargentea.',
      ],
      facts: [
        { label: 'Compañera', value: 'Ursus (osa)' },
        { label: 'Arma', value: 'Arco de escamas de dragón' },
        { label: 'Romance', value: 'Yorus Mantoazur' },
        { label: 'Origen', value: 'Del sur' },
      ],
    },
    {
      id: 'drakhan', name: 'Drakhan', short: 'Monje', tagline: 'Monje semiorco',
      img: 'campaigns/oro/portraits/drakhan.png',
      status: 'Elegido de Uthgar', dot: ACCENT,
      blurb: [
        'Hijo de Kadu la Silenciosa (orca) y de Saldren Ilestra. En EP056 desterró para siempre tanto la furia de Uthgar como la de su propia sangre orca. Lleva tres tatuajes tribales —Grifo, Lobo y Árbol— que tiran hacia el noroeste.',
        'Candidato a unir las tribus utgardianas. Cartógrafo del grupo, habla orco y dracónico, es inmune a los venenos y a la embriaguez, y el único que tiene el mapa del Anauroch.',
      ],
      facts: [
        { label: 'Padres', value: 'Kadu y Saldren Ilestra' },
        { label: 'Tatuajes', value: 'Grifo · Lobo · Árbol' },
        { label: 'Idiomas', value: 'Orco, dracónico' },
        { label: 'Inmune a', value: 'Venenos y alcohol' },
      ],
    },
    {
      id: 'agaricus', name: 'Agáricus', short: 'Druida', tagline: 'Druida micónido',
      img: 'campaigns/oro/portraits/agaricus.png',
      status: 'Regresó en EP077', dot: ACCENT,
      blurb: [
        'Expulsado de su tribu; usa el Enclave Esmeralda y el claro de Mielikki. Es el único con el conjuro de revivir y su compañero es Rannicus. Se marchó del grupo en EP027 y regresó en EP077.',
        'Su colonia micónida fue capturada por los ilícidos y quedó casi aniquilada. Comparte jugador con Alfred (Sanmar): durante un tiempo convivieron como doble personalidad.',
      ],
      facts: [
        { label: 'Círculo', value: 'Enclave Esmeralda' },
        { label: 'Compañero', value: 'Rannicus' },
        { label: 'Se fue', value: 'EP027' },
        { label: 'Volvió', value: 'EP077' },
      ],
    },
    {
      id: 'janzu', name: 'Janzu', short: 'Pícaro', tagline: 'Pícaro mediano · Cofregrande',
      img: 'campaigns/oro/portraits/janzu.png',
      status: 'Infectado de licantropía', dot: NEUTRAL,
      blurb: [
        'Su padre, Glimpetor —arpista y agente Zhentarim—, lo cambió por un burro de pequeño; Janzu acabó heredando su puesto. Fue infiltrado Zhentarim y luego Arpero, con Enon Yadar como superior y traidor.',
        'Entiende enano y dracónico. Tenía un perro-montura, Tostada, enterrado en Orlbar. Está infectado de licantropía de rata: se transforma en luna llena tras la mordedura de un hombre lobo.',
      ],
      facts: [
        { label: 'Alias', value: 'Cofregrande' },
        { label: 'Facción', value: 'Arpistas' },
        { label: 'Padre', value: 'Glimpetor' },
        { label: 'Idiomas', value: 'Enano, dracónico' },
      ],
    },
    {
      id: 'alfred', name: 'Alfred', short: 'Forjado', tagline: 'Forjado (autómata) guerrero',
      status: 'Se despidió (EP077)', dot: NEUTRAL,
      blurb: [
        'Autómata venido de Eberron, creado para la guerra y liberado al acabar esta; fue mercenario, soldado y finalmente profesor de esgrima. Los ilícidos lo raptaron y lo intercambiaron a la colonia de Orlbar.',
        'Escapó y acabó con Jarlaxle y los drow de Bregan D’aerthe. No respira ni duerme, es inmune a la enfermedad de las profundidades y puede cambiar a una armadura de mithril. Se despidió del grupo en EP077 para volver con los suyos.',
      ],
      facts: [
        { label: 'Origen', value: 'Eberron' },
        { label: 'Se unió', value: 'EP028 / 031' },
        { label: 'Se fue', value: 'EP077' },
        { label: 'Vocación', value: 'Profesor de esgrima' },
      ],
    },
  ],

  strahd: [
    {
      id: 'elara', name: 'Elara', short: 'Clérigo', tagline: 'Clérigo aasimar · La jugadora',
      status: 'La jugadora', dot: ACCENT,
      blurb: ['Clériga aasimar, el personaje de la jugadora. Un faro de luz frente a las tinieblas de Barovia.'],
      facts: [{ label: 'Clase', value: 'Clérigo' }, { label: 'Raza', value: 'Aasimar' }],
    },
    {
      id: 'syn', name: 'Syn', short: 'Barda', tagline: 'Barda tiefling',
      status: 'Intercambió clase en EP14', dot: ACCENT,
      blurb: ['Tiefling. Desde EP15 lleva la clase de barda (Vicious Mockery, Patrón Hipnótico), tras intercambiarla con Arkarian.'],
      facts: [{ label: 'Clase', value: 'Barda (desde EP15)' }, { label: 'Raza', value: 'Tiefling' }],
    },
    {
      id: 'arkarian', name: 'Arkarian', short: 'Guerrero', tagline: 'Guerrero tiefling',
      status: 'Enterró el hacha (EP17)', dot: ACCENT,
      blurb: ['Tiefling. Desde EP15 es el guerrero del grupo (Giant’s Might, Second Wind). Heredó el hacha y la Runa de Fuego, y la enterró en EP17.'],
      facts: [{ label: 'Clase', value: 'Guerrero (desde EP15)' }, { label: 'Raza', value: 'Tiefling' }],
    },
    {
      id: 'bhaziros', name: 'Bhaziros', short: 'Paladín', tagline: 'Paladín dracónico',
      status: 'Juramento en Barovia', dot: ACCENT,
      blurb: ['Paladín de linaje dracónico.'],
      facts: [{ label: 'Clase', value: 'Paladín' }, { label: 'Raza', value: 'Dracónico' }],
    },
    {
      id: 'naylin', name: 'Naylin', short: 'Druida', tagline: 'Druida eladrin',
      status: 'Magia de las estaciones', dot: ACCENT,
      blurb: ['Druida eladrin, ligada a las estaciones del Reino Feérico.'],
      facts: [{ label: 'Clase', value: 'Druida' }, { label: 'Raza', value: 'Eladrin' }],
    },
  ],

  saltmarsh: [
    {
      id: 'virellia', name: 'Virellia Arcanthis', short: 'Maga', tagline: 'Maga elfa',
      img: 'campaigns/saltmarsh/portraits/virellia.png',
      status: 'La jugadora', dot: ACCENT,
      blurb: ['Maga elfa, el personaje de la jugadora. Lleva en el bolso un coral marino mágico sin identificar.'],
      facts: [{ label: 'Clase', value: 'Maga' }, { label: 'Raza', value: 'Elfa' }],
    },
    {
      id: 'genya', name: 'Genya Gulyayev', short: 'Fighter', tagline: 'Fighter dragonborn',
      img: 'campaigns/saltmarsh/portraits/genya.png',
      status: 'Sargento de la guardia', dot: ACCENT,
      blurb: ['Guerrera dragonborn. Es sargento de la guardia de Saltmarsh.'],
      facts: [{ label: 'Clase', value: 'Fighter' }, { label: 'Raza', value: 'Dragonborn' }],
    },
    {
      id: 'arkos', name: 'Arkos Hightower', short: 'Bard', tagline: 'Bardo humano',
      img: 'campaigns/saltmarsh/portraits/arkos.jpg',
      status: 'Drogado con Sal Roja', dot: NEUTRAL,
      blurb: ['Bardo humano. Cassandra lo drogó con Sal Roja; despertó físicamente reforzado y sin recuerdos. Usa un código de emergencia: cielo, suelo, árbol.'],
      facts: [{ label: 'Clase', value: 'Bard' }, { label: 'Raza', value: 'Humano' }],
    },
    {
      id: 'dravok', name: 'Dravok Kurrid', short: 'Bárbaro', tagline: 'Bárbaro goliath',
      img: 'campaigns/saltmarsh/portraits/Dravok.jpeg',
      status: 'Hijo adoptivo de Lankus', dot: ACCENT,
      blurb: ['Bárbaro goliath, hijo adoptivo de Lankus, dueño de la taberna Cabra de Mimbre. Brak-Thar, el Ejecutor, lo llama "hermano".'],
      facts: [{ label: 'Clase', value: 'Bárbaro' }, { label: 'Raza', value: 'Goliath' }],
    },
    {
      id: 'lodd', name: "Loddrantelmo 'Lodd'", short: 'Druida', tagline: 'Druida gnomo · Siempremojado',
      img: 'campaigns/saltmarsh/portraits/Lodd.png',
      status: 'Recuerda huellas en el pantano', dot: ACCENT,
      blurb: ['Druida gnomo, apodado Siempremojado. Recuerda huellas de hombres lagarto en el pantano.'],
      facts: [{ label: 'Clase', value: 'Druida' }, { label: 'Raza', value: 'Gnomo' }],
    },
  ],

  brujaluz: [
    {
      id: 'triss', name: 'Triss', short: 'Rogue', tagline: 'Pícara · La jugadora',
      img: 'campaigns/brujaluz/portraits/triss.png',
      status: 'La jugadora', dot: ACCENT,
      blurb: ['Pícara, el personaje de la jugadora. Robó las cartas entre las brujas (sin leer) y perdió un punto de Fuerza permanente en un trato con Bavlorna.'],
      facts: [{ label: 'Clase', value: 'Rogue' }, { label: 'Trato', value: 'Bavlorna (−1 Fuerza)' }],
    },
    {
      id: 'tharad', name: 'Tharad', short: 'Guerrero', tagline: 'Guerrero Rune Knight',
      status: 'Caballero de las runas', dot: ACCENT,
      blurb: ['Guerrero Rune Knight.'],
      facts: [{ label: 'Clase', value: 'Guerrero (Rune Knight)' }],
    },
    {
      id: 'luli', name: 'Luli', short: 'Barda', tagline: 'Barda · Monarca de Brujaluz',
      status: 'Monarca de Brujaluz', dot: ACCENT,
      blurb: ['Bardesa. Ostenta el título de Monarca de Brujaluz.'],
      facts: [{ label: 'Clase', value: 'Barda' }, { label: 'Título', value: 'Monarca de Brujaluz' }],
    },
    {
      id: 'remy', name: 'Remy', short: 'Druida', tagline: 'Druida',
      status: 'Curó a Brotor', dot: ACCENT,
      blurb: ['Druida (pronombres masculinos). Curó a Brotor durante el rescate de los niños.'],
      facts: [{ label: 'Clase', value: 'Druida' }],
    },
    {
      id: 'lirael', name: 'Lirael', short: 'Sorcerer', tagline: 'Sorcerer harengon',
      status: 'Magia salvaje', dot: ACCENT,
      blurb: ['Hechicera harengon.'],
      facts: [{ label: 'Clase', value: 'Sorcerer' }, { label: 'Raza', value: 'Harengon' }],
    },
  ],
}

// El mundo: lugares, entidades y saberes.
export const lore = {
  oro: [
    { id: 'lunargentea', name: 'Lunargentea', type: 'Ciudad', blurb: 'Ciudad de magia restringida y base de la Compañía del Oso.',
      paras: [
        'Ciudad de magia restringida y base de la Compañía del Oso. Alberga la academia donde estudia Corvo, la taberna La Hoja Brillante Esgrimida —con un cráneo de dragón verde sobre la puerta— y a NPCs como Yorus Mantoazur y Tristán Hojasolar.',
        'En las últimas sesiones sufre asesinatos nocturnos y una plaga de ghouls ligada a la corrupción de Orcus y al ritualista Enon.',
      ] },
    { id: 'anauroch', name: 'El Anauroch', type: 'Desierto', blurb: 'Desierto frío y árido; el destino actual del grupo.',
      paras: [
        'Desierto frío y árido, dividido en el Alto Hielo, la Planicie de las Piedras Alzadas y la Espada. La despoblada Planicie es el lugar más probable para encontrar dragones.',
        'La Carretera Negra, trazada por los Centarim como ruta comercial, lo cruza. Es el destino actual del grupo, siguiendo la pista del rey de los dragones al norte.',
      ] },
    { id: 'orlbar', name: 'Orlbar', type: 'Pueblo', blurb: 'Pueblo en decadencia marcado por los ilícidos.',
      paras: [
        'Pueblo en decadencia, marcado por los ilícidos y su “Ikea de carne”. Aquí murió Tostada, el perro de Janzu, enterrado con ritos de Urogalán, y de aquí escapó Alfred.',
        'Punto de paso obligado hacia el Anauroch, ahora convertido en un monumento a la podredumbre.',
      ] },
    { id: 'altobosque', name: 'Alto Bosque', type: 'Región', blurb: 'Bosque de dragones y viejos secretos.',
      paras: [
        'Bosque de dragones. Hogar de Chloracridara, la dragona verde cuyo cráneo cuelga en la taberna de Lunargentea, y de Ondrur —Andrea—, la dragona con piel humana que fue amante de Venti.',
      ] },
    { id: 'norte', name: 'El Norte y las Tribus Bárbaras', type: 'Región', blurb: 'Tierra de las tribus utgardianas y sus dioses.',
      paras: [
        'Tierra de las tribus utgardianas —Grifo, Lobo, Árbol y otras—, de sus dioses y de sus guerras. Es clave en el destino de Drakhan, candidato a unirlas, y en el pasado de Leia.',
      ] },
    { id: 'infraoscuridad', name: 'La Infraoscuridad y el Reino Remoto', type: 'Región', blurb: 'Túneles, ilícidos y el Perdido Estelar.',
      paras: [
        'Los túneles de la Infraoscuridad, poblados por micónidos e ilícidos, y más allá el Reino Remoto, de donde procede el Perdido Estelar que acecha a Venti.',
      ] },
    { id: 'beorunna', name: 'Pozo de Beorunna', type: 'Lugar', blurb: 'Ligado a Corvo, el hermano perdido de Venti.',
      paras: [
        'Lugar ligado a Corvo, el hermano perdido de Venti al que busca por toda la campaña, y que le robó al Culto del Dragón un fragmento del Orbe.',
      ] },
    { id: 'orcus', name: 'Orcus', type: 'Entidad', blurb: 'Señor de los no muertos; su corrupción alimenta ghouls.',
      paras: [
        'Señor de los no muertos. Su corrupción alimenta ghouls y rituales por el mundo. Venti selló un pacto con él, y su ritualista Enon sigue suelto, dejando rituales a su paso.',
      ] },
    { id: 'dragones', name: 'Dragones y el Orbe', type: 'Lore', blurb: 'La crisis central: el Orbe dracónico y Malystryx.',
      paras: [
        'La crisis central de la campaña: el Orbe dracónico, la dragona Malystryx y el Culto del Dragón. Los fragmentos del Orbe guardan cada uno un tercio de un alma dracónica, y Venti carga con dos.',
      ] },
    { id: 'sucesos', name: 'Sucesos del mundo', type: 'Lore', blurb: 'Los grandes acontecimientos que enmarcan la historia.',
      paras: [
        'Los grandes acontecimientos que enmarcan la historia: la guerra de los gigantes, las intrigas del norte y los movimientos de las facciones por todo Faerûn.',
      ] },
  ],
}
