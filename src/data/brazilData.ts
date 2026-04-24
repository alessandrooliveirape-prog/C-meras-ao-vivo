import { Camera, State } from '../types';

export const BRAZIL_STATES: State[] = [
  {
    name: 'Rio de Janeiro',
    code: 'RJ',
    region: 'Sudeste',
    description: 'Acompanhe as icônicas praias de Copacabana, Ipanema e o trânsito da capital fluminense em tempo real.',
    cities: [
      { name: 'Rio de Janeiro', slug: 'rio-de-janeiro', stateCode: 'RJ', description: 'Câmeras na Cidade Maravilhosa.', cameraCount: 15 },
      { name: 'Niterói', slug: 'niteroi', stateCode: 'RJ', description: 'Visão da Ponte Rio-Niterói e orla.', cameraCount: 4 }
    ]
  },
  {
    name: 'São Paulo',
    code: 'SP',
    region: 'Sudeste',
    description: 'Veja o movimento da Avenida Paulista, as marginais e o clima nas principais cidades do estado de São Paulo.',
    cities: [
      { name: 'São Paulo', slug: 'sao-paulo', stateCode: 'SP', description: 'Monitoramento da maior metrópole da América Latina.', cameraCount: 22 },
      { name: 'Santos', slug: 'santos', stateCode: 'SP', description: 'Acompanhe o Porto de Santos e as praias do litoral paulista.', cameraCount: 8 },
      { name: 'Campinas', slug: 'campinas', stateCode: 'SP', description: 'Clima e trânsito no interior paulista.', cameraCount: 5 }
    ]
  },
  {
    name: 'Santa Catarina',
    code: 'SC',
    region: 'Sul',
    description: 'Câmeras ao vivo de Balneário Camboriú, Florianópolis e da Serra Catarinense.',
    cities: [
      { name: 'Florianópolis', slug: 'florianopolis', stateCode: 'SC', description: 'Belezas da Ilha da Magia em tempo real.', cameraCount: 12 },
      { name: 'Balneário Camboriú', slug: 'balneario-camboriu', stateCode: 'SC', description: 'A Dubai brasileira vista de cima.', cameraCount: 7 }
    ]
  },
  {
    name: 'Bahia',
    code: 'BA',
    region: 'Nordeste',
    description: 'Veja o Pelourinho, o Elevador Lacerda e as praias paradisíacas da Bahia.',
    cities: [
      { name: 'Salvador', slug: 'salvador', stateCode: 'BA', description: 'Câmeras na capital baiana.', cameraCount: 10 }
    ]
  },
  {
    name: 'Paraná',
    code: 'PR',
    region: 'Sul',
    description: 'Acompanhe Curitiba, as Cataratas do Iguaçu e o movimento nas estradas do Paraná.',
    cities: [
      { name: 'Curitiba', slug: 'curitiba', stateCode: 'PR', description: 'Capital paranaense ao vivo.', cameraCount: 14 },
      { name: 'Cascavel', slug: 'cascavel', stateCode: 'PR', description: 'Câmeras da região oeste.', cameraCount: 5 },
      { name: 'Foz do Iguaçu', slug: 'foz-do-iguacu', stateCode: 'PR', description: 'Veja as Cataratas em tempo real.', cameraCount: 8 }
    ]
  },
  {
    name: 'Distrito Federal',
    code: 'DF',
    region: 'Centro-Oeste',
    description: 'Veja o Eixo Monumental, o Congresso Nacional e o clima na capital federal.',
    cities: [
      { name: 'Brasília', slug: 'brasilia', stateCode: 'DF', description: 'Câmeras na capital do Brasil.', cameraCount: 12 }
    ]
  },
  {
    name: 'Minas Gerais',
    code: 'MG',
    region: 'Sudeste',
    description: 'Veja as montanhas de Minas, o trânsito de BH e as cidades históricas.',
    cities: [
      { name: 'Belo Horizonte', slug: 'belo-horizonte', stateCode: 'MG', description: 'Câmeras na capital mineira.', cameraCount: 8 }
    ]
  },
  {
    name: 'Pernambuco',
    code: 'PE',
    region: 'Nordeste',
    description: 'Acompanhe a orla de Boa Viagem e o arquipélago de Fernando de Noronha.',
    cities: [
      { name: 'Recife', slug: 'recife', stateCode: 'PE', description: 'Visual da capital pernambucana.', cameraCount: 6 }
    ]
  },
  {
    name: 'Ceará',
    code: 'CE',
    region: 'Nordeste',
    description: 'Veja as praias de Fortaleza e o movimento na Beira-Mar.',
    cities: [
      { name: 'Fortaleza', slug: 'fortaleza', stateCode: 'CE', description: 'Câmeras na capital cearense.', cameraCount: 9 }
    ]
  },
  {
    name: 'Amazonas',
    code: 'AM',
    region: 'Norte',
    description: 'Acompanhe a Floresta Amazônica, o Rio Negro e a capital Manaus em tempo real.',
    cities: [
      { name: 'Manaus', slug: 'manaus', stateCode: 'AM', description: 'Câmeras na capital do Amazonas.', cameraCount: 5 }
    ]
  }
];

export const CAMERAS: Camera[] = [
  {
    id: '1',
    title: 'Avenida Paulista (MASP)',
    slug: 'av-paulista-masp',
    city: 'São Paulo',
    state: 'São Paulo',
    stateCode: 'SP',
    description: 'Monitoramento oficial da Avenida Paulista através do sistema interativo da CET-SP.',
    type: 'portal',
    url: 'https://www.cetsp.com.br/consultas/cameras-cet.aspx',
    thumbnail: 'https://images.unsplash.com/photo-1543059152-473410c90351?auto=format&fit=crop&q=80&w=800',
    views: 89000,
    tags: ['transito', 'cet', 'oficial']
  },
  {
    id: '2',
    title: 'Monitoramento Praia Grande',
    slug: 'praia-grande-ao-vivo',
    city: 'Praia Grande',
    state: 'São Paulo',
    stateCode: 'SP',
    description: 'Acesso ao portal de câmeras ao vivo da Prefeitura de Praia Grande.',
    type: 'portal',
    url: 'https://cameras.praiagrande.sp.gov.br/aovivo/',
    thumbnail: 'https://images.unsplash.com/photo-1590481232840-7e8e4f1648a7?auto=format&fit=crop&q=80&w=800',
    views: 32000,
    tags: ['praia', 'segurança', 'daer']
  },
  {
    id: '3',
    title: 'Recife - Trânsito ao Vivo',
    slug: 'recife-transito',
    city: 'Recife',
    state: 'Pernambuco',
    stateCode: 'PE',
    description: 'Câmeras de monitoramento de tráfego em tempo real da Prefeitura do Recife.',
    type: 'portal',
    url: 'https://www2.recife.pe.gov.br/servico/transito-ao-vivo',
    thumbnail: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&q=80&w=800',
    views: 45000,
    tags: ['transito', 'autarquia', 'oficial']
  },
  {
    id: '4',
    title: 'Bahia - Câmera Interativa SSP',
    slug: 'bahia-ssp-interativa',
    city: 'Salvador',
    state: 'Bahia',
    stateCode: 'BA',
    description: 'Sistema de monitoramento interativo da Secretaria de Segurança Pública da Bahia.',
    type: 'portal',
    url: 'http://www.ba.gov.br/ssp/camera-interativa-2',
    thumbnail: 'https://images.unsplash.com/photo-1583070002131-01f9cc0c3f5d?auto=format&fit=crop&q=80&w=800',
    views: 11200,
    tags: ['seguranca', 'bahia', 'oficial']
  },
  {
    id: '5',
    title: 'Rodovias RS - DAER',
    slug: 'daer-rs-monitoramento',
    city: 'Rodovias',
    state: 'Rio Grande do Sul',
    stateCode: 'RS',
    description: 'Monitoramento de tráfego e clima nas rodovias estaduais do RS via DAER.',
    type: 'portal',
    url: 'https://www.daer.rs.gov.br/cameras-de-monitoramento',
    thumbnail: 'https://images.unsplash.com/photo-1598371302829-873b8893d5f3?auto=format&fit=crop&q=80&w=800',
    views: 22400,
    tags: ['rodovia', 'clima', 'daer']
  },
  {
    id: '6',
    title: 'Brasília - Eixo Monumental',
    slug: 'brasilia-eixo-monumental',
    city: 'Brasília',
    state: 'Distrito Federal',
    stateCode: 'DF',
    description: 'Vista do coração político do Brasil, mostrando o Eixo Monumental e Esplanada.',
    type: 'youtube',
    url: 'https://www.youtube.com/embed/Hn0Qz3z8rXk?autoplay=1&mute=1',
    thumbnail: 'https://images.unsplash.com/photo-1590481232840-7e8e4f1648a7?auto=format&fit=crop&q=80&w=800',
    views: 12200,
    tags: ['política', 'Brasília', 'clima']
  },
  {
    id: '7',
    title: 'Belo Horizonte - Praça da Liberdade',
    slug: 'belo-horizonte-liberdade',
    city: 'Belo Horizonte',
    state: 'Minas Gerais',
    stateCode: 'MG',
    description: 'Acompanhe o movimento na histórica Praça da Liberdade, coração cultural de BH.',
    type: 'youtube',
    url: 'https://www.youtube.com/embed/8VzP6F5o1Rk?autoplay=1&mute=1',
    thumbnail: 'https://images.unsplash.com/photo-1512403754473-27855fbc299f?auto=format&fit=crop&q=80&w=800',
    views: 8200,
    tags: ['centro', 'clima', 'minas']
  },
  {
    id: '8',
    title: 'Recife - Marco Zero',
    slug: 'recife-marco-zero',
    city: 'Recife',
    state: 'Pernambuco',
    stateCode: 'PE',
    description: 'Câmera ao vivo no Marco Zero de Recife, ponto turístico central do Recife Antigo.',
    type: 'youtube',
    url: 'https://www.youtube.com/embed/NQpxK6yDsqM?autoplay=1&mute=1',
    thumbnail: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&q=80&w=800',
    views: 11200,
    tags: ['porto', 'histórico', 'turismo']
  },
  {
    id: '9',
    title: 'Fortaleza - Beira Mar',
    slug: 'fortaleza-beira-mar',
    city: 'Fortaleza',
    state: 'Ceará',
    stateCode: 'CE',
    description: 'Monitoramento da Avenida Beira-Mar em Fortaleza, mostrando a orla e o mar do Ceará.',
    type: 'youtube',
    url: 'https://www.youtube.com/embed/zL64NqOQfO4?autoplay=1&mute=1',
    thumbnail: 'https://images.unsplash.com/photo-1559024094-4a1e4495c3c1?auto=format&fit=crop&q=80&w=800',
    views: 13500,
    tags: ['praia', 'cidade', 'turismo']
  },
  {
    id: '10',
    title: 'Manaus - Porto / Rio Negro',
    slug: 'manaus-porto',
    city: 'Manaus',
    state: 'Amazonas',
    stateCode: 'AM',
    description: 'Vista do porto de Manaus e do Rio Negro, capturando a movimentação fluvial da região.',
    type: 'youtube',
    url: 'https://www.youtube.com/embed/V2HIdmreFw4?autoplay=1&mute=1',
    thumbnail: 'https://images.unsplash.com/photo-1590481232840-7e8e4f1648a7?auto=format&fit=crop&q=80&w=800',
    views: 6500,
    tags: ['rio', 'porto', 'amazonas']
  },
  {
    id: '11',
    title: 'City Câmeras São Paulo',
    slug: 'city-cameras-sp',
    city: 'São Paulo',
    state: 'São Paulo',
    stateCode: 'SP',
    description: 'Programa oficial municipal de integração de câmeras da Prefeitura de São Paulo.',
    type: 'portal',
    url: 'https://www.citycameras.prefeitura.sp.gov.br',
    thumbnail: 'https://images.unsplash.com/photo-1543059152-473410c90351?auto=format&fit=crop&q=80&w=800',
    views: 15400,
    tags: ['monitoramento', 'municipal', 'sp']
  },
  {
    id: '12',
    title: 'DER-SP Câmeras Mapa',
    slug: 'der-sp-mapa',
    city: 'Rodovias estaduais',
    state: 'São Paulo',
    stateCode: 'SP',
    description: 'Mapa com imagens em tempo real das rodovias administradas pelo DER-SP.',
    type: 'portal',
    url: 'https://www.der.sp.gov.br/WebSite/Servicos/ServicosOnline/CamerasOnlineMapa.aspx',
    thumbnail: 'https://images.unsplash.com/photo-1598371302829-873b8893d5f3?auto=format&fit=crop&q=80&w=800',
    views: 28900,
    tags: ['rodovia', 'transito', 'der']
  },
  {
    id: '13',
    title: 'Assis Ao Vivo',
    slug: 'assis-ao-vivo',
    city: 'Assis',
    state: 'São Paulo',
    stateCode: 'SP',
    description: 'Página pública com pontos monitorados ao vivo em Assis, SP.',
    type: 'portal',
    url: 'https://www.assis.sp.gov.br/ao-vivo',
    thumbnail: 'https://images.unsplash.com/photo-1512403754473-27855fbc299f?auto=format&fit=crop&q=80&w=800',
    views: 4200,
    tags: ['monitoramento', 'municipal']
  },
  {
    id: '14',
    title: 'Santos Mapeada',
    slug: 'santos-mapeada',
    city: 'Santos',
    state: 'São Paulo',
    stateCode: 'SP',
    description: 'Mapa oficial de câmeras em tempo real da Prefeitura de Santos.',
    type: 'portal',
    url: 'https://egov.santos.sp.gov.br/santosmapeada/Gestao/Cameras/MapaCamera/',
    thumbnail: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=800',
    views: 18700,
    tags: ['monitoramento', 'santos', 'mapa']
  },
  {
    id: '15',
    title: 'NitTrans Niterói',
    slug: 'nittrans-niteroi',
    city: 'Niterói',
    state: 'Rio de Janeiro',
    stateCode: 'RJ',
    description: 'Aplicação pública oficial com câmeras de trânsito de Niterói.',
    type: 'portal',
    url: 'https://appnittrans.niteroi.rj.gov.br',
    thumbnail: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=800',
    views: 9300,
    tags: ['transito', 'niteroi', 'rj']
  }
];
