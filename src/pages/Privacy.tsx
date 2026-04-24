import React from 'react';
import { SEO } from '../components/SEO';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm">
      <SEO title="Política de Privacidade" description="Entenda como tratamos seus dados e o uso de cookies no Brasil ao Vivo." />
      <h1 className="text-4xl font-black text-gray-900 tracking-tight">Política de Privacidade</h1>
      
      <div className="prose prose-blue max-w-none text-gray-600 font-medium leading-relaxed space-y-6">
        <p>A sua privacidade é importante para nós. É política do Brasil ao Vivo respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Brasil ao Vivo, e outros sites que possuímos e operamos.</p>
        
        <h2 className="text-2xl font-bold text-gray-900">1. Coleta de Informações</h2>
        <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.</p>

        <h2 className="text-2xl font-bold text-gray-900">2. Uso de Cookies</h2>
        <p>Utilizamos cookies para melhorar sua experiência. Como muitos sites, usamos cookies para exibir anúncios relevantes através do Google AdSense.</p>

        <h2 className="text-2xl font-bold text-gray-900">3. Google AdSense</h2>
        <p>O Google, como fornecedor de terceiros, utiliza cookies para exibir anúncios no nosso site. Com o cookie DART, o Google pode exibir anúncios com base nas visitas que o utilizador fez a este e a outros sites na Internet.</p>
      </div>
    </div>
  );
};
