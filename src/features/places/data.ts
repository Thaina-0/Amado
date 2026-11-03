import type { Photo, Place } from './places'

const SEGURO = 'https://www.seguroviagem.srv.br/blog/o-que-fazer-em-ilheus/'
const KAYAK = 'https://www.kayak.com.br/Ilheus.31154.guide'
const CHOCOLATE =
  'https://catracalivre.com.br/viagem-livre/estrada-do-chocolate-um-lindo-passeio-pelas-terras-de-jorge-amado/'
const BEACH_TENNIS = 'https://wellhub.com/pt-br/search/partners/beach-tennis-team-centro/'
const BACK_DOOR = 'https://it.surf-forecast.com/breaks/Back-door'
const WIKI_ILHEUS = 'https://pt.wikipedia.org/wiki/Ilh%C3%A9us'
const WIKI_VESUVIO = 'https://pt.wikipedia.org/wiki/Bar_Ves%C3%BAvio'
const BAHIA_WS = 'https://bahia.ws/en/history-of-st-sebastians-cathedral-in-ilheus/'
const LAGOA_GUIDE = 'https://bahia.ws/en/lagoa-encantada-tourism-guide'
const LAGOA_APA =
  'https://en.wikipedia.org/wiki/Lagoa_Encantada_e_Rio_Almada_Environmental_Protection_Area'
const TUDOGOSTOSO =
  'https://www.tudogostoso.com.br/noticias/turismo-do-chocolate-onde-visitar-fabricas-artesanais-no-sul-da-bahia-a21707.htm'
const TELELISTAS_CABANAS = 'https://www.telelistas.net/ba/ilheus/barracas+de+praia+restaurantes'
const WELLHUB_ACADEMIAS = [
  'https://wellhub.com/pt-br/search/partners/selfit-ilheus-sao-francisco/',
  'https://wellhub.com/pt-br/search/partners/academia-corpore-centro-ilheus',
  'https://wellhub.com/pt-br/search/partners/pontal-fit-pontal/',
] as const

export const BASE_PLACES: readonly Omit<Place, 'photos'>[] = [
  {
    id: 'bar-vesuvio',
    category: 'gastronomia',
    name: 'Bar Vesúvio',
    summary: {
      pt: 'Bar no centro histórico',
      en: 'Bar in the historic centre',
      es: 'Bar en el centro histórico',
    },
    details: {
      pt: 'Sente-se onde, no romance Gabriela, Cravo e Canela, o dono de bar Nacib atendia os seus fregueses. O Vesúvio abriu em 1919, fundado por dois imigrantes italianos, e é um dos comércios mais antigos da cidade. Nos anos 1940 chegou a se chamar Bar Triunfo, mas o nome de origem voltou.\n\nFica na praça da Catedral, em plena Ilhéus de Jorge Amado. Peça o quibe, o pedido tradicional da casa.',
      en: "Sit where, in the novel Gabriela, Clove and Cinnamon, the bar owner Nacib served his regulars. Vesúvio opened in 1919, founded by two Italian immigrants, and it is one of the oldest businesses in the city. In the 1940s it was called Bar Triunfo for a while, but the original name came back.\n\nIt stands on the cathedral square, right in the heart of Jorge Amado's Ilhéus. Order the kibbeh, the house's traditional choice.",
      es: 'Siéntate donde, en la novela Gabriela, clavo y canela, el dueño del bar Nacib atendía a sus clientes. El Vesúvio abrió en 1919, fundado por dos inmigrantes italianos, y es uno de los comercios más antiguos de la ciudad. En los años 1940 llegó a llamarse Bar Triunfo, pero volvió el nombre original.\n\nEstá en la plaza de la Catedral, en plena Ilhéus de Jorge Amado. Pide el quibe, el pedido tradicional de la casa.',
    },
    sources: [SEGURO, WIKI_VESUVIO],
    example: true,
  },
  {
    id: 'bataclan',
    category: 'gastronomia',
    name: 'Bataclan',
    summary: {
      pt: 'Restaurante e espaço cultural no Centro',
      en: 'Restaurant and cultural space downtown',
      es: 'Restaurante y espacio cultural en el Centro',
    },
    details: {
      pt: 'Já foi cabaré e cassino, e nos anos 1920 e 1930 recebia os coronéis do cacau, os fazendeiros ricos da época. Depois de restaurado, hoje é restaurante, tem loja de lembranças e uma visita guiada pelos antigos quartos. Os guias contam a lenda de uma passagem secreta que ligaria o Bataclan ao Bar Vesúvio.\n\nO lugar aparece nos livros de Jorge Amado. Venha almoçar ou jantar e sentir como era a Ilhéus do tempo do cacau.',
      en: "It was once a cabaret and casino, and in the 1920s and 1930s it welcomed the cacao colonels, the wealthy planters of the time. Restored, it is now a restaurant with a gift shop and a guided visit through the old rooms. Guides tell the legend of a secret passage that supposedly linked the Bataclan to Bar Vesúvio.\n\nThe place appears in Jorge Amado's books. Come for lunch or dinner and feel what Ilhéus was like in the cacao era.",
      es: 'Fue cabaré y casino, y en los años 1920 y 1930 recibía a los coroneles del cacao, los ricos hacendados de la época. Restaurado, hoy es restaurante, tiene tienda de recuerdos y una visita guiada por los antiguos cuartos. Los guías cuentan la leyenda de un pasaje secreto que uniría el Bataclan con el Bar Vesúvio.\n\nEl lugar aparece en los libros de Jorge Amado. Ven a almorzar o cenar y a sentir cómo era la Ilhéus de la época del cacao.',
    },
    sources: [SEGURO, WIKI_ILHEUS],
    example: true,
  },
  {
    id: 'acaraje-da-zelia',
    category: 'gastronomia',
    name: 'Acarajé da Zélia',
    summary: {
      pt: 'Acarajé na beira da rua, no Pontal',
      en: 'Roadside acarajé in Pontal',
      es: 'Acarajé a orillas de la calle, en Pontal',
    },
    details: {
      pt: 'Um cantinho simples, na beira da rua, no Pontal, que quem já provou recomenda muito. O acarajé é um bolinho de feijão-fradinho frito no azeite de dendê, um dos sabores mais baianos que existem.\n\nSe você quer comida de rua com gosto de Bahia, é uma boa parada.',
      en: 'A simple little spot on the roadside in Pontal that people highly recommend. Acarajé is a black-eyed pea fritter fried in palm oil, one of the most Bahian flavors there is.\n\nIf you want street food with the taste of Bahia, it is a good stop.',
      es: 'Un rincón sencillo, a orillas de la calle, en Pontal, muy recomendado por quienes lo probaron. El acarajé es una croqueta de frijol de carita frita en aceite de dendê, uno de los sabores más bahianos que existen.\n\nSi quieres comida callejera con sabor a Bahía, es una buena parada.',
    },
    sources: [KAYAK],
    example: true,
  },
  {
    id: 'estrada-do-chocolate',
    category: 'gastronomia',
    name: 'Estrada do Chocolate',
    summary: {
      pt: 'Fazendas de cacau entre Ilhéus e Uruçuca',
      en: 'Cacao farms between Ilhéus and Uruçuca',
      es: 'Fincas de cacao entre Ilhéus y Uruçuca',
    },
    details: {
      pt: 'O cacau chegou à região vindo da Amazônia e mudou a história de Ilhéus: no começo do século XX a cidade viveu o seu auge, com palacetes, os “coronéis do cacau” e a construção do porto, em 1924.\n\nHoje a BA-262 liga Ilhéus a Uruçuca e chega à BR-101. No caminho, fazendas mostram como o cacau vira chocolate, algumas com fábrica de chocolate gourmet, e há também sítios históricos, rios e cachoeiras. Reserve uma tarde para ir sem pressa.',
      en: 'Cacao came to the region from the Amazon and changed the history of Ilhéus: in the early 20th century the city had its heyday, with mansions, the “cacao colonels” and the building of the port in 1924.\n\nToday the BA-262 links Ilhéus and Uruçuca and reaches the BR-101. Along the way, farms show how cacao becomes chocolate, some with a gourmet chocolate factory, and there are also historic sites, rivers and waterfalls. Set aside an afternoon and take it slowly.',
      es: 'El cacao llegó a la región desde la Amazonía y cambió la historia de Ilhéus: a principios del siglo XX la ciudad vivió su auge, con palacetes, los “coroneles del cacao” y la construcción del puerto, en 1924.\n\nHoy la BA-262 une Ilhéus y Uruçuca y llega a la BR-101. En el camino, las fincas muestran cómo el cacao se vuelve chocolate, algunas con fábrica de chocolate gourmet, y hay también sitios históricos, ríos y cascadas. Reserva una tarde para ir sin prisa.',
    },
    sources: [CHOCOLATE, WIKI_ILHEUS],
    example: true,
  },
  {
    id: 'casa-de-jorge-amado',
    category: 'cultura',
    name: 'Casa de Jorge Amado',
    summary: {
      pt: 'Museu no Centro histórico',
      en: 'Museum in the historic centre',
      es: 'Museo en el centro histórico',
    },
    details: {
      pt: 'Nesta casa o menino Jorge Amado viveu parte da infância e da adolescência. O casarão neoclássico foi construído nos anos 1920 pelo pai do escritor, um produtor de cacau. Hoje conta a vida de Jorge Amado com fotos, objetos da família e edições dos livros traduzidos.\n\nAntes de ir, confira se está aberta: a casa passou por reforma e, durante esse tempo, parte do acervo ficou no Teatro Municipal.',
      en: "In this house young Jorge Amado lived part of his childhood and teenage years. The neoclassical mansion was built in the 1920s by the writer's father, a cacao grower. Today it tells Jorge Amado's life through photos, family objects and editions of his translated books.\n\nBefore you go, check that it is open: the house went through renovation and, during that time, part of the collection was kept at the Teatro Municipal.",
      es: 'En esta casa el niño Jorge Amado vivió parte de su infancia y adolescencia. La casona neoclásica fue construida en los años 1920 por el padre del escritor, un productor de cacao. Hoy cuenta la vida de Jorge Amado con fotos, objetos de la familia y ediciones de sus libros traducidos.\n\nAntes de ir, confirma que esté abierta: la casa pasó por una reforma y, durante ese tiempo, parte del acervo estuvo en el Teatro Municipal.',
    },
    sources: [SEGURO],
    example: true,
  },
  {
    id: 'catedral-de-sao-sebastiao',
    category: 'cultura',
    name: 'Catedral de São Sebastião',
    summary: {
      pt: 'Igreja no centro histórico',
      en: 'Church in the historic centre',
      es: 'Iglesia en el centro histórico',
    },
    details: {
      pt: 'Domina a praça, de frente para o mar. As obras começaram em 1931 e a catedral só foi inaugurada em 1967, depois de mais de 30 anos. É a igreja-mãe da diocese de Ilhéus e tem cerca de 48 metros de altura.\n\nÉ um dos cartões-postais do Centro e aparece nos livros de Jorge Amado. Aproveite para atravessar a praça e fazer uma pausa no Vesúvio.',
      en: "It dominates the square, facing the sea. Work began in 1931 and the cathedral was only inaugurated in 1967, after more than 30 years. It is the mother church of the Ilhéus diocese and stands about 48 metres tall.\n\nIt is one of downtown's postcards and appears in Jorge Amado's books. Cross the square afterwards and take a break at Vesúvio.",
      es: 'Domina la plaza, frente al mar. Las obras empezaron en 1931 y la catedral solo se inauguró en 1967, tras más de 30 años. Es la iglesia madre de la diócesis de Ilhéus y mide cerca de 48 metros de altura.\n\nEs una de las postales del Centro y aparece en los libros de Jorge Amado. Aprovecha para cruzar la plaza y hacer una pausa en el Vesúvio.',
    },
    sources: [SEGURO, BAHIA_WS, WIKI_ILHEUS],
    example: true,
  },
  {
    id: 'teatro-municipal',
    category: 'cultura',
    name: 'Teatro Municipal',
    summary: {
      pt: 'Teatro na Rua Jorge Amado',
      en: 'Theatre on Rua Jorge Amado',
      es: 'Teatro en la Rua Jorge Amado',
    },
    details: {
      pt: 'Foi construído nos anos 1920, no auge do cacau, e chegou a ser considerado um dos teatros mais bem equipados do interior do Nordeste. Depois passou anos em ruínas, mas foi reformado e hoje recebe exposições e eventos culturais.\n\nFica na Rua Jorge Amado, a mesma da Casa de Cultura, e já guardou o acervo da casa durante a reforma, com entrada gratuita.',
      en: "It was built in the 1920s, at the height of the cacao boom, and was once considered one of the best-equipped theatres in the Northeast interior. It then spent years in ruins, but it was restored and now hosts exhibitions and cultural events.\n\nIt is on Rua Jorge Amado, the same street as the Casa de Cultura, and it once kept the house's collection during its renovation, with free entry.",
      es: 'Se construyó en los años 1920, en pleno auge del cacao, y llegó a considerarse uno de los teatros mejor equipados del interior del Nordeste. Después pasó años en ruinas, pero se restauró y hoy recibe exposiciones y eventos culturales.\n\nEstá en la Rua Jorge Amado, la misma de la Casa de Cultura, y llegó a guardar el acervo de la casa durante la reforma, con entrada gratuita.',
    },
    sources: [SEGURO, WIKI_ILHEUS],
    example: true,
  },
  {
    id: 'igreja-de-sao-jorge',
    category: 'cultura',
    name: 'Igreja de São Jorge',
    summary: {
      pt: 'Igreja Matriz com Museu de Arte Sacra',
      en: 'Mother church with a Sacred Art Museum',
      es: 'Iglesia Matriz con Museo de Arte Sacro',
    },
    details: {
      pt: 'É uma das construções religiosas mais antigas de Ilhéus, e a cidade nasceu com o nome dela: a Vila de São Jorge dos Ilhéus, fundada em 1534. A data mais citada para a primeira igreja é 1556, mas as fontes divergem.\n\nNa sacristia há um pequeno Museu de Arte Sacra, com imagens e peças antigas. Fica perto do Palácio Paranaguá e aparece nos livros de Jorge Amado. Confirme o horário antes de ir.',
      en: "It is one of the oldest religious buildings in Ilhéus, and the city was born with its name: the Vila de São Jorge dos Ilhéus, founded in 1534. The most quoted date for the first church is 1556, but sources differ.\n\nIn the sacristy there is a small Sacred Art Museum, with old images and objects. It is near the Paranaguá Palace and appears in Jorge Amado's books. Check the opening hours before you go.",
      es: 'Es una de las construcciones religiosas más antiguas de Ilhéus, y la ciudad nació con su nombre: la Vila de São Jorge dos Ilhéus, fundada en 1534. La fecha más citada para la primera iglesia es 1556, pero las fuentes difieren.\n\nEn la sacristía hay un pequeño Museo de Arte Sacro, con imágenes y piezas antiguas. Está cerca del Palacio Paranaguá y aparece en los libros de Jorge Amado. Confirma el horario antes de ir.',
    },
    sources: [SEGURO, WIKI_ILHEUS],
    example: true,
  },
  {
    id: 'praia-dos-milionarios',
    category: 'praias',
    name: 'Praia dos Milionários',
    summary: {
      pt: 'A praia mais estruturada da Zona Sul',
      en: 'The best-equipped beach in the South Zone',
      es: 'La playa mejor equipada de la Zona Sur',
    },
    details: {
      pt: 'Areia dourada com pontinhos pretos, barracas, banheiros e movimento o dia todo: é a praia mais estruturada da Zona Sul de Ilhéus. O nome lembra as casas de veraneio que os coronéis do cacau mantinham aqui, quando o cacau enriquecia a região.\n\nÉ ótima para passar o dia com estrutura por perto. Fica entre as melhores praias do sul da cidade.',
      en: "Golden sand with black specks, stalls, restrooms and activity all day: it is the best-equipped beach in Ilhéus' South Zone. The name recalls the summer houses the cacao colonels kept here, when cacao made the region rich.\n\nIt is a great place to spend the day with facilities nearby. It is among the best beaches in the south of the city.",
      es: 'Arena dorada con puntitos negros, puestos, baños y movimiento todo el día: es la playa mejor equipada de la Zona Sur de Ilhéus. El nombre recuerda las casas de veraneo que los coroneles del cacao tenían aquí, cuando el cacao enriquecía la región.\n\nEs ideal para pasar el día con servicios cerca. Está entre las mejores playas del sur de la ciudad.',
    },
    sources: [SEGURO, KAYAK],
    example: true,
  },
  {
    id: 'praia-de-cururupe',
    category: 'praias',
    name: 'Praia de Cururupe',
    summary: {
      pt: 'Indicada para esportes radicais',
      en: 'Recommended for extreme sports',
      es: 'Indicada para deportes extremos',
    },
    details: {
      pt: 'Cururupe tem história antiga: em 1559, nesta praia, aconteceu a chamada “Batalha dos Nadadores”, entre os povos tupiniquim e tupinambá. Hoje o lugar é indicado para esportes radicais.\n\nFica na região sul, onde estão as melhores praias de Ilhéus. Um bom destino para quem quer praia com um pouco de aventura.',
      en: "Cururupe has an old story: in 1559, on this beach, the so-called “Battle of the Swimmers” took place between the Tupiniquim and Tupinambá peoples. Today the place is recommended for extreme sports.\n\nIt is in the south, where Ilhéus' best beaches are. A good destination if you want a beach with a bit of adventure.",
      es: 'Cururupe tiene una historia antigua: en 1559, en esta playa, ocurrió la llamada “Batalla de los Nadadores”, entre los pueblos tupiniquim y tupinambá. Hoy el lugar se recomienda para deportes extremos.\n\nEstá en la región sur, donde se encuentran las mejores playas de Ilhéus. Un buen destino si quieres playa con un poco de aventura.',
    },
    sources: [KAYAK, WIKI_ILHEUS],
    example: true,
  },
  {
    id: 'surf',
    category: 'esportes',
    name: 'Surf',
    summary: {
      pt: 'Back Door é a praia preferida dos surfistas',
      en: 'Back Door is the surfers’ favourite beach',
      es: 'Back Door es la playa preferida de los surfistas',
    },
    details: {
      pt: 'A onda mais conhecida de Ilhéus quebra na Back Door, em Olivença: a praia preferida dos surfistas, que já recebeu campeonatos. É uma ponta aberta, com ondas que nem sempre aparecem, e costuma funcionar melhor na primavera. Cuidado com as pedras e com o mar cheio de gente quando está bom.\n\nO vento forte da temporada de chuvas ajuda o surf. Se for em janeiro, Olivença ainda tem a Puxada do Mastro, a festa de São Sebastião.',
      en: "Ilhéus' best-known wave breaks at Back Door, in Olivença: the surfers' favourite beach, which has hosted competitions. It is an exposed point with waves that do not always show up, and it usually works best in spring. Watch out for rocks and for a crowded line-up when it is good.\n\nThe strong wind of the rainy season helps surfing. If you go in January, Olivença also has the Puxada do Mastro, the São Sebastião festival.",
      es: 'La ola más conocida de Ilhéus rompe en Back Door, en Olivença: la playa preferida de los surfistas, que ya recibió campeonatos. Es una punta expuesta con olas que no siempre aparecen, y suele funcionar mejor en primavera. Cuidado con las piedras y con el mar lleno de gente cuando está bueno.\n\nEl viento fuerte de la temporada de lluvias ayuda al surf. Si vas en enero, Olivença también tiene la Puxada do Mastro, la fiesta de São Sebastião.',
    },
    sources: [KAYAK, BACK_DOOR, WIKI_ILHEUS],
    example: true,
  },
  {
    id: 'beach-tennis',
    category: 'esportes',
    name: 'Beach Tennis',
    summary: {
      pt: 'Aulas no Centro, do iniciante ao avançado',
      en: 'Lessons downtown, beginner to advanced',
      es: 'Clases en el Centro, de principiante a avanzado',
    },
    details: {
      pt: 'Quer jogar na areia? O beach tennis mistura raquete, rede e praia, parecido com o tênis. Em Ilhéus, a Beach Tennis Team é referência desde 2012 e dá aulas para crianças, adolescentes, adultos e idosos, do iniciante ao avançado.\n\nÉ uma boa chance de experimentar o esporte, mesmo que você nunca tenha segurado uma raquete.',
      en: 'Want to play on the sand? Beach tennis mixes rackets, a net and the beach, much like tennis. In Ilhéus, the Beach Tennis Team has been a reference since 2012 and gives lessons to children, teenagers, adults and seniors, from beginner to advanced.\n\nIt is a good chance to try the sport, even if you have never held a racket.',
      es: '¿Quieres jugar en la arena? El beach tennis mezcla raqueta, red y playa, parecido al tenis. En Ilhéus, el Beach Tennis Team es referencia desde 2012 y da clases para niños, adolescentes, adultos y mayores, de principiante a avanzado.\n\nEs una buena oportunidad para probar el deporte, aunque nunca hayas sostenido una raqueta.',
    },
    sources: [BEACH_TENNIS],
    example: true,
  },
  {
    id: 'stand-up-paddle',
    category: 'esportes',
    name: 'Stand Up Paddle e Caiaque',
    summary: {
      pt: 'Remo em pé, caiaque e canoagem em São Sebastião',
      en: 'Paddleboarding, kayak and canoeing in São Sebastião',
      es: 'Remo de pie, kayak y canotaje en São Sebastião',
    },
    details: {
      pt: 'Em Ilhéus há espaços que oferecem stand up paddle, caiaque e canoagem, com reserva. Veja onde praticar na próxima tela.',
      en: 'Ilhéus has venues that offer stand up paddle, kayak and canoeing, by booking. See where to practise on the next screen.',
      es: 'En Ilhéus hay espacios que ofrecen stand up paddle, kayak y canotaje, con reserva. Mira dónde practicar en la próxima pantalla.',
    },
    sources: [
      'https://wellhub.com/pt-br/search/partners/sup-ilheus-sao-sebastiao/',
      'https://www.bahianoticias.com.br/bnhall/noticia/1528-em-ilheus-cana-brava-resort-reune-atividades-com-foco-em-esportes',
    ],
    example: true,
  },
  {
    id: 'kitesurf-windsurf',
    category: 'esportes',
    name: 'Kitesurf e Windsurf',
    summary: {
      pt: 'Vento forte na temporada chuvosa',
      en: 'Strong wind in the rainy season',
      es: 'Viento fuerte en la temporada de lluvias',
    },
    details: {
      pt: 'Ilhéus tem vento. Na temporada de chuvas, o vento forte deixa o mar bom para o surf, o kitesurf e o windsurf. A praia de Cururupe é indicada para esportes radicais, então vale perguntar por lá onde e com quem praticar.\n\nSe você é iniciante, procure uma escola ou um guia local antes de entrar na água.',
      en: 'Ilhéus has wind. In the rainy season, the strong wind makes the sea good for surfing, kitesurfing and windsurfing. Cururupe beach is recommended for extreme sports, so it is worth asking there where and with whom to practice.\n\nIf you are a beginner, look for a school or a local guide before getting in the water.',
      es: 'Ilhéus tiene viento. En la temporada de lluvias, el viento fuerte deja el mar bueno para el surf, el kitesurf y el windsurf. La playa de Cururupe se recomienda para deportes extremos, así que vale preguntar allí dónde y con quién practicar.\n\nSi eres principiante, busca una escuela o un guía local antes de entrar al agua.',
    },
    sources: [KAYAK],
    example: true,
  },
  {
    id: 'futevolei',
    category: 'esportes',
    name: 'Futevôlei',
    summary: {
      pt: 'Centro de treinamento e copa de futevôlei em Ilhéus',
      en: 'Training centre and footvolley cup in Ilhéus',
      es: 'Centro de entrenamiento y copa de futevôlei en Ilhéus',
    },
    details: {
      pt: 'O CTM10, Centro de Treinamento Esportivo e Funcional, está ligado ao time de futevôlei de Ilhéus e organiza a Copa do CTM10 de Futevôlei, que teve a 8ª edição em abril de 2025. As notícias não dizem o endereço nem se há aula aberta a turistas. Veja mais em Onde praticar.',
      en: 'The CTM10, a Sports and Functional Training Centre, is tied to the Ilhéus footvolley team and runs the CTM10 Footvolley Cup, whose 8th edition was held in April 2025. The news pieces do not give the address or say whether tourists can join a class. See more in Where to practise.',
      es: 'El CTM10, Centro de Entrenamiento Deportivo y Funcional, está ligado al equipo de futevôlei de Ilhéus y organiza la Copa del CTM10 de Futevôlei, cuya 8.ª edición fue en abril de 2025. Las noticias no dan la dirección ni dicen si hay clases abiertas a turistas. Mira más en Dónde practicar.',
    },
    sources: [
      'https://portalbolanarede.com/futvolei-de-ilheus-sofre-ataque-criminoso',
      'https://www.ilheus.net/2025/03/ilheus-fortalece-o-esporte-e-apoia-a-8a-copa-do-ctm10-de-futevolei.html',
    ],
    example: true,
  },
  {
    id: 'academias',
    category: 'esportes',
    name: 'Academias',
    summary: {
      pt: 'Musculação, funcional e dança em várias partes da cidade',
      en: 'Weights, functional training and dance across the city',
      es: 'Musculación, funcional y baile en varias zonas de la ciudad',
    },
    details: {
      pt: 'Ilhéus tem academias em vários bairros, do Centro ao Pontal, com musculação, treino funcional, dança e lutas. Veja quais são na próxima tela.\n\nAs fontes não dizem se há diária para quem está de passagem. Pergunte no local antes de ir.',
      en: 'Ilhéus has gyms in several neighbourhoods, from the Centre to Pontal, with weights, functional training, dance and martial arts. See which ones on the next screen.\n\nThe sources do not say whether there is a day pass for visitors. Ask on site before you go.',
      es: 'Ilhéus tiene gimnasios en varios barrios, del Centro a Pontal, con musculación, entrenamiento funcional, baile y artes marciales. Mira cuáles son en la próxima pantalla.\n\nLas fuentes no dicen si hay pase diario para quien está de paso. Pregunta en el lugar antes de ir.',
    },
    sources: WELLHUB_ACADEMIAS,
    example: true,
  },
  {
    id: 'barracas-dos-milionarios',
    category: 'praias',
    name: 'Barracas da Praia dos Milionários',
    summary: {
      pt: 'Barracas com banheiros e movimento o dia inteiro',
      en: 'Beach stalls with restrooms, busy all day',
      es: 'Puestos de playa con baños y movimiento todo el día',
    },
    details: {
      pt: 'A Praia dos Milionários é a que mais concentra barracas em Ilhéus, com banheiros e movimento o dia inteiro. Quem quer comer à beira-mar e ficar perto da estrutura encontra aqui o melhor ponto de partida.\n\nAs praias do litoral norte têm menos barracas.',
      en: 'Milionários is the beach with the most stalls in Ilhéus, with restrooms and activity all day. If you want to eat by the sea and stay close to facilities, this is the best place to start.\n\nThe beaches on the north coast have fewer stalls.',
      es: 'Milionários es la playa que más puestos concentra en Ilhéus, con baños y movimiento todo el día. Si quieres comer junto al mar y estar cerca de la infraestructura, es el mejor punto de partida.\n\nLas playas del litoral norte tienen menos puestos.',
    },
    sources: [SEGURO],
    example: true,
  },
  {
    id: 'cabanas-da-rodovia-olivenca',
    category: 'praias',
    name: 'Cabanas da Rodovia Ilhéus–Olivença',
    summary: {
      pt: 'Cabanas e restaurantes de praia no caminho de Olivença',
      en: 'Beach cabins and restaurants on the road to Olivença',
      es: 'Cabañas y restaurantes de playa en el camino a Olivença',
    },
    details: {
      pt: 'Um catálogo de telefones lista cabanas de praia ao longo da rodovia Ilhéus–Olivença, entre elas a Cabana Guarany, perto do km 3, e a Cabana Tio Dico, perto do km 5.\n\nÉ uma lista de terceiros e pode estar desatualizada: confirme se a cabana está aberta antes de ir.',
      en: 'A phone directory lists beach cabins along the Ilhéus–Olivença highway, among them Cabana Guarany, near km 3, and Cabana Tio Dico, near km 5.\n\nIt is a third-party list and may be out of date: check that the cabin is open before you go.',
      es: 'Un directorio telefónico lista cabañas de playa a lo largo de la carretera Ilhéus–Olivença, entre ellas la Cabana Guarany, cerca del km 3, y la Cabana Tio Dico, cerca del km 5.\n\nEs una lista de terceros y puede estar desactualizada: confirma que la cabaña esté abierta antes de ir.',
    },
    sources: [TELELISTAS_CABANAS],
    example: true,
  },
  {
    id: 'lagoa-encantada',
    category: 'natureza',
    name: 'Lagoa Encantada',
    summary: {
      pt: 'Lagoa de água doce com cachoeiras e ilhas flutuantes',
      en: 'Freshwater lagoon with waterfalls and floating islands',
      es: 'Laguna de agua dulce con cascadas e islas flotantes',
    },
    details: {
      pt: 'É uma grande lagoa de água doce dentro de uma área de proteção ambiental. O jeito mais fácil de chegar é de barco, a partir de Sambaituba, pelo Rio Almada. O passeio inclui cachoeiras e as ilhas flutuantes, que se movem com o vento.\n\nAs fontes divergem sobre a distância e o acesso por terra pode ser difícil na época de chuva. Combine o passeio com um operador local.',
      en: 'It is a large freshwater lagoon inside an environmental protection area. The easiest way to get there is by boat from Sambaituba, along the Almada River. The trip includes waterfalls and the floating islands, which drift with the wind.\n\nThe sources disagree on the distance, and the land access can be hard in the rainy season. Arrange the trip with a local operator.',
      es: 'Es una gran laguna de agua dulce dentro de un área de protección ambiental. La forma más fácil de llegar es en barco, desde Sambaituba, por el Río Almada. El paseo incluye cascadas y las islas flotantes, que se mueven con el viento.\n\nLas fuentes difieren en la distancia y el acceso por tierra puede ser difícil en la temporada de lluvias. Organiza el paseo con un operador local.',
    },
    sources: [SEGURO, LAGOA_GUIDE, LAGOA_APA],
    example: true,
  },
  {
    id: 'rio-almada',
    category: 'natureza',
    name: 'Rio Almada',
    summary: {
      pt: 'O rio que leva de barco à Lagoa Encantada',
      en: 'The river that takes you by boat to Lagoa Encantada',
      es: 'El río que lleva en barco a la Laguna Encantada',
    },
    details: {
      pt: 'O Rio Almada nasce na Lagoa Encantada e é a rota de barco até ela, a partir de Sambaituba. Faz parte da mesma área de proteção ambiental, e a fonte aponta potencial para esportes aquáticos.\n\nConfirme com um operador local como e quando fazer o trajeto.',
      en: 'The Almada River starts at Lagoa Encantada and is the boat route to it, from Sambaituba. It is part of the same environmental protection area, and the source points to potential for water sports.\n\nCheck with a local operator how and when to make the trip.',
      es: 'El Río Almada nace en la Laguna Encantada y es la ruta en barco hasta ella, desde Sambaituba. Forma parte de la misma área de protección ambiental, y la fuente señala potencial para deportes acuáticos.\n\nConfirma con un operador local cómo y cuándo hacer el trayecto.',
    },
    sources: [SEGURO, LAGOA_APA],
    example: true,
  },
  {
    id: 'igreja-de-nossa-senhora-da-escada',
    category: 'cultura',
    name: 'Igreja de Nossa Senhora da Escada',
    summary: {
      pt: 'Igreja que guarda a memória do aldeamento jesuíta de Olivença',
      en: 'Church that keeps the memory of the Jesuit settlement in Olivença',
      es: 'Iglesia que guarda la memoria del poblado jesuita de Olivença',
    },
    details: {
      pt: 'Olivença fica no caminho de Una, e sua história nasce de um aldeamento jesuíta do século 17. A memória dele está nesta igreja.\n\nO distrito também guarda a presença do povo Tupinambá e a tradição da Puxada do Mastro de São Sebastião.',
      en: 'Olivença is on the way to Una, and its history begins with a 17th-century Jesuit settlement. The memory of it is kept in this church.\n\nThe district also holds the presence of the Tupinambá people and the tradition of the Puxada do Mastro de São Sebastião.',
      es: 'Olivença está camino a Una, y su historia nace de un poblado jesuita del siglo XVII. La memoria de ese poblado está en esta iglesia.\n\nEl distrito guarda también la presencia del pueblo Tupinambá y la tradición de la Puxada do Mastro de São Sebastião.',
    },
    sources: [SEGURO],
    example: true,
  },
  {
    id: 'fazenda-yrere',
    category: 'gastronomia',
    name: 'Fazenda Yrerê',
    summary: {
      pt: 'Fazenda de cacau com visita e degustação',
      en: 'Cacao farm with a visit and tasting',
      es: 'Finca de cacao con visita y degustación',
    },
    details: {
      pt: 'Fazenda de cacau no km 11 da rodovia Ilhéus–Itabuna. A visita termina com uma degustação.\n\nConfirme horário e reserva antes de ir.',
      en: 'A cacao farm at km 11 of the Ilhéus–Itabuna highway. The visit ends with a tasting.\n\nCheck the hours and book before you go.',
      es: 'Finca de cacao en el km 11 de la carretera Ilhéus–Itabuna. La visita termina con una degustación.\n\nConfirma el horario y reserva antes de ir.',
    },
    sources: [SEGURO],
    example: true,
  },
  {
    id: 'fazenda-provisao',
    category: 'gastronomia',
    name: 'Fazenda Provisão',
    summary: {
      pt: 'Fazenda de cacau que foi cenário da novela Renascer',
      en: 'Cacao farm that was a set for the soap opera Renascer',
      es: 'Finca de cacao que fue escenario de la novela Renascer',
    },
    details: {
      pt: 'Fazenda de cacau usada como locação da novela Renascer, que também oferece hospedagem.\n\nConfirme visitas e horários antes de ir.',
      en: 'A cacao farm used as a filming location for the soap opera Renascer, which also offers lodging.\n\nCheck visits and hours before you go.',
      es: 'Finca de cacao usada como locación de la novela Renascer, que también ofrece alojamiento.\n\nConfirma visitas y horarios antes de ir.',
    },
    sources: [SEGURO],
    example: true,
  },
  {
    id: 'fazenda-riachuelo',
    category: 'gastronomia',
    name: 'Fazenda Riachuelo e Mendoá',
    summary: {
      pt: 'Fábrica de chocolate dentro de uma fazenda de cacau',
      en: 'Chocolate factory inside a cacao farm',
      es: 'Fábrica de chocolate dentro de una finca de cacao',
    },
    details: {
      pt: 'A Mendoá Chocolates funciona na Fazenda Riachuelo, na rodovia Ilhéus–Uruçuca. O passeio mostra a fábrica, com as salas de fermentação e secagem, e uma caminhada pelo cacaual, onde dá para provar o fruto. Termina com degustação de chocolates finos.\n\nA fábrica para para manutenção entre dezembro e janeiro.',
      en: 'Mendoá Chocolates operates at Fazenda Riachuelo, on the Ilhéus–Uruçuca highway. The tour shows the factory, with its fermentation and drying rooms, and a walk through the cacao grove, where you can taste the fruit. It ends with a tasting of fine chocolates.\n\nThe factory closes for maintenance between December and January.',
      es: 'Mendoá Chocolates funciona en la Fazenda Riachuelo, en la carretera Ilhéus–Uruçuca. El paseo muestra la fábrica, con las salas de fermentación y secado, y una caminata por el cacaotal, donde se puede probar el fruto. Termina con una degustación de chocolates finos.\n\nLa fábrica cierra por mantenimiento entre diciembre y enero.',
    },
    sources: [SEGURO, TUDOGOSTOSO],
    example: true,
  },
  {
    id: 'chocolate-caseiro-ilheus',
    category: 'gastronomia',
    name: 'Chocolate Caseiro Ilhéus',
    summary: {
      pt: 'Fábrica de chocolate de 1985, no começo da Estrada do Chocolate',
      en: 'Chocolate factory from 1985, at the start of the Chocolate Road',
      es: 'Fábrica de chocolate de 1985, al inicio del Camino del Chocolate',
    },
    details: {
      pt: 'A fábrica foi fundada em 1985. Quem visita conhece como a produção do chocolate baiano mudou ao longo das décadas e prova os produtos feitos ali.\n\nGrupos grandes precisam agendar. Confirme o horário de fim de semana e feriado.',
      en: 'The factory was founded in 1985. Visitors learn how Bahian chocolate production has changed over the decades and taste the products made there.\n\nLarge groups need to book. Check the weekend and holiday hours.',
      es: 'La fábrica fue fundada en 1985. Quien la visita conoce cómo cambió la producción del chocolate bahiano a lo largo de las décadas y prueba los productos hechos allí.\n\nLos grupos grandes deben reservar. Confirma el horario de fin de semana y feriado.',
    },
    sources: [TUDOGOSTOSO],
    example: true,
  },
  {
    id: 'bahia-cacau',
    category: 'gastronomia',
    name: 'Bahia Cacau',
    summary: {
      pt: 'Primeira fábrica de chocolate da agricultura familiar do Brasil',
      en: 'The first family-farming chocolate factory in Brazil',
      es: 'La primera fábrica de chocolate de la agricultura familiar de Brasil',
    },
    details: {
      pt: 'Descrita como a primeira fábrica de chocolate da agricultura familiar do Brasil. A visita mostra a produção sustentável da marca e o apoio aos pequenos produtores da região.\n\nA fonte não lista as atividades do passeio. Pergunte ao local.',
      en: 'Described as the first family-farming chocolate factory in Brazil. The visit shows the brand’s sustainable production and its support for small local growers.\n\nThe source does not list the activities of the tour. Ask the venue.',
      es: 'Descrita como la primera fábrica de chocolate de la agricultura familiar de Brasil. La visita muestra la producción sostenible de la marca y el apoyo a los pequeños productores de la región.\n\nLa fuente no lista las actividades del paseo. Pregunta en el lugar.',
    },
    sources: [TUDOGOSTOSO],
    example: true,
  },
]

// invariant: every photo comes from Wikimedia Commons under a free license, and its author, license and page are shown with it
export const PHOTOS: Record<string, readonly Photo[]> = {
  'bar-vesuvio': [
    {
      src: '/places/bar-vesuvio/1.jpg',
      author: 'Sintegrity',
      license: 'CC BY-SA 4.0',
      page: 'https://commons.wikimedia.org/wiki/File:Ilh%C3%A9us_-_Bar_Ves%C3%BAvio_(2).jpg',
    },
    {
      src: '/places/bar-vesuvio/2.jpg',
      author: 'Sintegrity',
      license: 'CC BY-SA 4.0',
      page: 'https://commons.wikimedia.org/wiki/File:Ilh%C3%A9us_-_Catedral_e_Bar_Ves%C3%BAvio.jpg',
    },
    {
      src: '/places/bar-vesuvio/3.jpg',
      author: 'Zaharinha',
      license: 'CC BY-SA 4.0',
      page: 'https://commons.wikimedia.org/wiki/File:Bar_Vesuvio_em_Ilh%C3%A9us_-_2017.jpg',
    },
  ],
  bataclan: [
    {
      src: '/places/bataclan/1.jpg',
      author: 'Friduxa',
      license: 'CC BY-SA 4.0',
      page: 'https://commons.wikimedia.org/wiki/File:Bataclan-2021.jpg',
    },
    {
      src: '/places/bataclan/2.jpg',
      author: 'Sintegrity',
      license: 'CC BY-SA 4.0',
      page: 'https://commons.wikimedia.org/wiki/File:Ilh%C3%A9us_-_Bataclan_(17).jpg',
    },
    {
      src: '/places/bataclan/3.jpg',
      author: 'Sintegrity',
      license: 'CC BY-SA 4.0',
      page: 'https://commons.wikimedia.org/wiki/File:Ilh%C3%A9us_-_Bataclan_(11).jpg',
    },
  ],
  'acaraje-da-zelia': [
    {
      src: '/places/acaraje-da-zelia/1.jpg',
      author: 'DiegoL569',
      license: 'CC BY-SA 4.0',
      page: 'https://commons.wikimedia.org/wiki/File:Baianas_do_Acaraj%C3%A9.jpg',
      illustrative: true,
    },
  ],
  'estrada-do-chocolate': [
    {
      src: '/places/estrada-do-chocolate/1.jpg',
      author: 'Míriam Ramalho',
      license: 'CC BY 4.0',
      page: 'https://commons.wikimedia.org/wiki/File:Cocoa_from_Provis%C3%A3o_Farm.jpg',
    },
  ],
  'casa-de-jorge-amado': [
    {
      src: '/places/casa-de-jorge-amado/1.jpg',
      author: 'Sintegrity',
      license: 'CC BY-SA 4.0',
      page: 'https://commons.wikimedia.org/wiki/File:Ilh%C3%A9us_-_Casa_Jorge_Amado_(2).jpg',
    },
    {
      src: '/places/casa-de-jorge-amado/2.jpg',
      author: 'Jaynara Morais',
      license: 'CC BY-SA 4.0',
      page: 'https://commons.wikimedia.org/wiki/File:Casa_de_Jorge_Amado_Ilh%C3%A9us_2021.jpg',
    },
    {
      src: '/places/casa-de-jorge-amado/3.jpg',
      author: 'Friduxa',
      license: 'CC BY-SA 4.0',
      page: 'https://commons.wikimedia.org/wiki/File:Casa_de_cultura_jorge_amado-2008.jpg',
    },
  ],
  'catedral-de-sao-sebastiao': [
    {
      src: '/places/catedral-de-sao-sebastiao/1.jpg',
      author: 'Rafael Deminicis',
      license: 'CC BY-SA 4.0',
      page: 'https://commons.wikimedia.org/wiki/File:Catedral_de_S%C3%A3o_Sebasti%C3%A3o_Ilh%C3%A9us_BA7.jpg',
    },
    {
      src: '/places/catedral-de-sao-sebastiao/2.jpg',
      author: 'Rafael Deminicis',
      license: 'CC BY-SA 4.0',
      page: 'https://commons.wikimedia.org/wiki/File:Catedral_de_S%C3%A3o_Sebasti%C3%A3o_Ilh%C3%A9us_BA1.jpg',
    },
  ],
  'teatro-municipal': [
    {
      src: '/places/teatro-municipal/1.jpg',
      author: 'MVenturin',
      license: 'CC BY-SA 4.0',
      page: 'https://commons.wikimedia.org/wiki/File:Teatro_Municipal_de_Ilh%C3%A9us_02.jpg',
    },
    {
      src: '/places/teatro-municipal/2.jpg',
      author: 'Williams Porto',
      license: 'CC BY-SA 4.0',
      page: 'https://commons.wikimedia.org/wiki/File:Teatro_Municipal_de_Ilh%C3%A9us.jpg',
    },
    {
      src: '/places/teatro-municipal/3.jpg',
      author: 'MVenturin',
      license: 'CC BY-SA 4.0',
      page: 'https://commons.wikimedia.org/wiki/File:Teatro_Municipal_de_Ilh%C3%A9us_03.jpg',
    },
  ],
  'igreja-de-sao-jorge': [
    {
      src: '/places/igreja-de-sao-jorge/1.jpg',
      author: 'Priscila Santos de Oliveira Matos',
      license: 'CC BY-SA 4.0',
      page: 'https://commons.wikimedia.org/wiki/File:Igreja_Matriz_de_S%C3%A3o_Jorge_%E2%80%93_Pra%C3%A7a_Rui_Barbosa.jpg',
    },
  ],
  'praia-dos-milionarios': [
    {
      src: '/places/praia-dos-milionarios/1.jpg',
      author: 'Leandro M800',
      license: 'CC0',
      page: 'https://commons.wikimedia.org/wiki/File:Praia_dos_Milion%C3%A1rios.jpg',
    },
  ],
  'praia-de-cururupe': [
    {
      src: '/places/praia-de-cururupe/1.jpg',
      author: 'Leandro M800',
      license: 'CC0',
      page: 'https://commons.wikimedia.org/wiki/File:Litoral_sul_de_Ilh%C3%A9us.jpg',
      illustrative: true,
    },
  ],
  surf: [
    {
      src: '/places/surf/1.jpg',
      author: 'Denise Mayumi from Sao Paulo, Brazil',
      license: 'CC BY 2.0',
      page: 'https://commons.wikimedia.org/wiki/File:Praia_de_Olivenca.jpg',
      illustrative: true,
    },
    {
      src: '/places/surf/2.jpg',
      author: 'Carlos Lúcio',
      license: 'CC BY-SA 3.0',
      page: 'https://commons.wikimedia.org/wiki/File:Praia_de_oliven%C3%A7a_(foto,_carl%C3%BAcio_maetinga)_-_panoramio.jpg',
      illustrative: true,
    },
  ],
  'beach-tennis': [
    {
      src: '/places/beach-tennis/1.jpg',
      author: 'Kashtanskaya',
      license: 'CC BY-SA 4.0',
      page: 'https://commons.wikimedia.org/wiki/File:Beach_tennis_brasil.jpg',
      illustrative: true,
    },
  ],
  'kitesurf-windsurf': [
    {
      src: '/places/kitesurf-windsurf/1.jpg',
      author: 'Coto14',
      license: 'Public domain',
      page: 'https://commons.wikimedia.org/wiki/File:Bahiakitesrf.jpg',
      illustrative: true,
    },
  ],
}
