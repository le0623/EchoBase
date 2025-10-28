"use client"

import { Calendar, Download } from "lucide-react"

export default function Analytics() {
  const analyticsData = [
    { metric: "Page Views", value: "125,430", change: "+12.5%", trend: "up" },
    { metric: "Unique Visitors", value: "45,231", change: "+8.2%", trend: "up" },
    { metric: "Bounce Rate", value: "32.5%", change: "-2.1%", trend: "down" },
    { metric: "Avg. Session Duration", value: "4m 32s", change: "+1.2%", trend: "up" },
  ]

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground">Track your website performance and user behavior.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:border-primary/50 transition-all duration-200">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Last 30 Days</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200">
            <Download className="w-4 h-4" />
            <span className="text-sm">Export</span>
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsData.map((item, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm mb-2">{item.metric}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-foreground">{item.value}</p>
              <span className={`text-sm font-semibold ${item.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Traffic Sources</h2>
          <div className="space-y-4">
            {[
              { source: "Organic Search", percentage: 45, value: "56,234" },
              { source: "Direct", percentage: 28, value: "34,892" },
              { source: "Social Media", percentage: 18, value: "22,456" },
              { source: "Referral", percentage: 9, value: "11,234" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-foreground">{item.source}</span>
                  <span className="text-sm font-semibold text-primary">{item.value}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-primary/50 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Device Breakdown</h2>
          <div className="space-y-4">
            {[
              { device: "Desktop", percentage: 62, value: "77,234" },
              { device: "Mobile", percentage: 32, value: "39,892" },
              { device: "Tablet", percentage: 6, value: "7,456" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-foreground">{item.device}</span>
                  <span className="text-sm font-semibold text-primary">{item.value}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-primary/50 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Top Pages</h2>
          <div className="space-y-3">
            {[
              { page: "/dashboard", views: "12,543" },
              { page: "/products", views: "9,234" },
              { page: "/pricing", views: "7,892" },
              { page: "/about", views: "5,456" },
              { page: "/contact", views: "3,234" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-200"
              >
                <span className="text-sm text-foreground truncate">{item.page}</span>
                <span className="text-sm font-semibold text-primary">{item.views}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
