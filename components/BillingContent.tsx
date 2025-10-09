'use client';

import { mockBillingData } from '@/lib/mockData';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import StatCard from './StatCard';
import PageHeader from './PageHeader';
import Image from 'next/image';

export default function BillingContent() {
  const { currentMonth, currentMonthChange, tokensUsed, tokensUsedChange, apiCalls, apiCallsChange, estimatedMonthEnd, estimatedMonthEndChange, providers, modelBreakdown } = mockBillingData;

  return (
    <div>
      <PageHeader
        title="Billing & Usage"
        description="Monitor your AI service costs and usage"
        actionButton={{ label: 'Add Provider', onClick: () => {} }}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Current Month"
            value={formatCurrency(currentMonth)}
            change={currentMonthChange}
          />
        </div>
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Tokens Used"
            value={formatNumber(tokensUsed)}
            change={tokensUsedChange}
          />
        </div>
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="API Calls"
            value={formatNumber(apiCalls)}
            change={apiCallsChange}
          />
        </div>
        <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
          <StatCard
            label="Est. Month End"
            value={formatCurrency(estimatedMonthEnd)}
            change={Math.abs(estimatedMonthEndChange)}
            isPositive={estimatedMonthEndChange > 0}
          />
        </div>
      </div>

      {/* Usage by Provider */}
      <div className="bg-white border border-[#e1e1e1] rounded-xl p-6 mb-6">
        <h2 className="heading-lg mb-2">Usage by Provider</h2>
        <p className="text-lg text-[#676767] mb-6">Current month breakdown by AI service</p>
        
        <div className="space-y-4">
          {providers.map((provider) => (
            <div key={provider.id} className="flex items-center gap-4 p-4 border border-[#e1e1e1] rounded-2xl">
              <Image src={provider.logo} alt={provider.name} width={39} height={39} />
              <div className="flex-1">
                <p className="text-[22px] font-bold">{provider.name}</p>
                <p className="text-base text-[#676767]">{provider.models}</p>
              </div>
              <div className="text-right">
                <p className="text-[22px] font-bold">{formatCurrency(provider.cost)}</p>
                <p className="text-base text-[#676767]">{provider.calls.toLocaleString()} calls</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-[#0198ff]" />
            </div>
          ))}
        </div>
      </div>

      {/* Usage by Model */}
      <div className="bg-white border border-[#e1e1e1] rounded-xl p-6">
        <h2 className="heading-lg mb-2">Usage by Model</h2>
        <p className="text-lg text-[#676767] mb-6">Detailed breakdown by AI model</p>
        
        <div className="space-y-4">
          {modelBreakdown.map((model, index) => (
            <div key={model.model}>
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-[22px] font-bold">{model.model}</p>
                  <p className="text-base text-[#676767]">{model.calls.toLocaleString()} calls</p>
                </div>
                <p className="text-[22px] font-bold">{formatCurrency(model.cost)}</p>
              </div>
              {index < modelBreakdown.length - 1 && (
                <div className="border-t border-[#e1e1e1]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}