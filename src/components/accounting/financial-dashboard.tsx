'use client'

import { useState, useEffect } from 'react'
import {
    TrendingUp, TrendingDown, DollarSign, PieChart,
    ArrowRight, Calendar, Filter, Download,
    BarChart3, Landmark, Receipt, Wallet,
    ArrowUpRight, ArrowDownRight, RefreshCcw
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { getDailyAccountingSummary, getProfitAndLossStatement, getBalanceSheetStatement } from "@/app/actions/accounting/reports"

export function FinancialDashboard() {
    const [loading, setLoading] = useState(true)
    const [dailyData, setDailyData] = useState<any>(null)
    const [plData, setPlData] = useState<any>(null)
    const [bsData, setBsData] = useState<any>(null)
    const [date, setDate] = useState(new Date())

    useEffect(() => {
        loadData()
    }, [date])

    async function loadData() {
        setLoading(true)
        try {
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

            const [daily, pl, bs] = await Promise.all([
                getDailyAccountingSummary(date),
                getProfitAndLossStatement(startOfMonth, endOfMonth),
                getBalanceSheetStatement(date)
            ])

            if (daily.success) setDailyData(daily.data)
            if (pl.success) setPlData(pl.data)
            if (bs.success) setBsData(bs.data)
        } catch (error) {
            console.error("Failed to load dashboard data", error)
        }
        setLoading(false)
    }

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val)
    }

    if (loading && !dailyData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCcw className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6 pb-12 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Financial Intelligence</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time accounting & performance analytics</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        {date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 gap-2">
                        <Download className="h-4 w-4" /> Export All
                    </Button>
                </div>
            </div>

            {/* Top KPIs - Daily Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-500 to-violet-600 text-white overflow-hidden relative group">
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <DollarSign size={120} />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-indigo-100 font-medium">Daily Sales</CardDescription>
                        <CardTitle className="text-2xl font-bold">{formatCurrency(dailyData?.totalSales || 0)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1 text-xs">
                            <span className="flex items-center text-emerald-300 font-bold">
                                <ArrowUpRight className="h-3 w-3" /> 12%
                            </span>
                            <span className="text-indigo-100/70">vs yesterday</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <CardHeader className="pb-2">
                        <CardDescription className="font-medium">Collections (Cash-In)</CardDescription>
                        <CardTitle className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(dailyData?.totalPaid || 0)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <span className="flex items-center text-emerald-500 font-bold">
                                <ArrowUpRight className="h-3 w-3" /> {((dailyData?.totalPaid / (dailyData?.totalSales || 1)) * 100).toFixed(0)}%
                            </span>
                            <span>recovery rate today</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <CardHeader className="pb-2">
                        <CardDescription className="font-medium">Daily Outflow</CardDescription>
                        <CardTitle className="text-2xl font-bold text-rose-500">
                            {formatCurrency(dailyData?.totalPurchases || 0)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Landmark className="h-3 w-3" />
                            <span>Supplier & Expense clearing</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <CardHeader className="pb-2">
                        <CardDescription className="font-medium">Monthly Net Impact</CardDescription>
                        <CardTitle className={`text-2xl font-bold ${plData?.netProfit >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                            {formatCurrency(plData?.netProfit || 0)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <PieChart className="h-3 w-3" />
                            <span>Current Monthly Profit</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Tabs for World Class Reports */}
            <Tabs defaultValue="daily" className="w-full">
                <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 mb-4 h-12 gap-1 rounded-xl">
                    <TabsTrigger value="daily" className="rounded-lg px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-sm">
                        Daily Summary
                    </TabsTrigger>
                    <TabsTrigger value="pl" className="rounded-lg px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-sm">
                        Profit & Loss
                    </TabsTrigger>
                    <TabsTrigger value="bs" className="rounded-lg px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-sm">
                        Balance Sheet
                    </TabsTrigger>
                </TabsList>

                {/* Daily Report Tab */}
                <TabsContent value="daily" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none">
                            <CardHeader className="border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-emerald-500" /> Revenue Streams
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {Object.entries(dailyData?.revenueByAccount || {}).length > 0 ? (
                                        Object.entries(dailyData.revenueByAccount).map(([acc, amt]: [any, any]) => (
                                            <div key={acc} className="flex items-center justify-between p-4 px-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                                <div className="font-medium text-slate-700 dark:text-slate-200">{acc}</div>
                                                <div className="font-bold text-slate-900 dark:text-white">{formatCurrency(amt)}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-slate-400 italic">No revenue activity recorded today</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none">
                            <CardHeader className="border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TrendingDown className="h-5 w-5 text-rose-500" /> Expense Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {Object.entries(dailyData?.expenseByAccount || {}).length > 0 ? (
                                        Object.entries(dailyData.expenseByAccount).map(([acc, amt]: [any, any]) => (
                                            <div key={acc} className="flex items-center justify-between p-4 px-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                                <div className="font-medium text-slate-700 dark:text-slate-200">{acc}</div>
                                                <div className="font-bold text-rose-500">{formatCurrency(amt)}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-slate-400 italic">No expense activity recorded today</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Profit & Loss Tab */}
                <TabsContent value="pl">
                    <Card className="border-slate-200 dark:border-slate-800">
                        <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Statement of Financial Performance (P&L)</CardTitle>
                                    <CardDescription>Monthly Period Performance</CardDescription>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Net Profit</div>
                                    <div className={`text-2xl font-black ${plData?.netProfit >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                                        {formatCurrency(plData?.netProfit || 0)}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* P&L Content Table-like view */}
                            <div className="max-w-3xl mx-auto py-10 px-6 space-y-8">
                                {/* Revenue */}
                                <section>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b pb-2">Revenue / Turnover</h3>
                                    {plData?.revenue.map((item: any) => (
                                        <div key={item.name} className="flex justify-between py-2 text-sm border-b border-slate-50 dark:border-slate-800">
                                            <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                                            <span className="font-medium">{formatCurrency(item.amount)}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between py-3 mt-2 bg-slate-50 dark:bg-slate-900/50 px-3 rounded-lg font-bold">
                                        <span>Total Operating Revenue</span>
                                        <span>{formatCurrency(plData?.totalRevenue || 0)}</span>
                                    </div>
                                </section>

                                {/* COGS */}
                                <section>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b pb-2">Cost of Goods Sold (COGS)</h3>
                                    {plData?.cogs.map((item: any) => (
                                        <div key={item.name} className="flex justify-between py-2 text-sm border-b border-slate-50 dark:border-slate-800">
                                            <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                                            <span className="font-medium">({formatCurrency(item.amount)})</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between py-3 mt-2 font-bold px-3">
                                        <span>Gross Profit</span>
                                        <span className="text-indigo-600">{formatCurrency((plData?.totalRevenue || 0) - (plData?.totalCOGS || 0))}</span>
                                    </div>
                                </section>

                                {/* Expenses */}
                                <section>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b pb-2">Operating Expenses</h3>
                                    {plData?.expenses.map((item: any) => (
                                        <div key={item.name} className="flex justify-between py-2 text-sm border-b border-slate-50 dark:border-slate-800">
                                            <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                                            <span className="font-medium">({formatCurrency(item.amount)})</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between py-3 mt-2 bg-slate-50 dark:bg-slate-900/50 px-3 rounded-lg font-bold border-t-2 border-slate-900 dark:border-white">
                                        <span>Net Financial Profit (EBITDA)</span>
                                        <span className={`text-xl ${plData?.netProfit >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                                            {formatCurrency(plData?.netProfit || 0)}
                                        </span>
                                    </div>
                                </section>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Balance Sheet Tab */}
                <TabsContent value="bs">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* ASSETS */}
                        <Card className="border-slate-200 dark:border-slate-800 h-full">
                            <CardHeader className="bg-slate-50 dark:bg-slate-900/50">
                                <CardTitle className="text-emerald-600 flex items-center gap-2">
                                    <Wallet className="h-5 w-5" /> Total Assets
                                </CardTitle>
                                <CardDescription>What the hospital owns</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {bsData?.assets.map((item: any) => (
                                        <div key={item.name} className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800">
                                            <span className="text-sm text-slate-600 dark:text-slate-300">{item.name}</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(item.amount)}</span>
                                        </div>
                                    ))}
                                    <div className="pt-4 flex justify-between items-center text-lg font-black bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                                        <span>Total Assets</span>
                                        <span className="text-emerald-600">{formatCurrency(bsData?.totalAssets || 0)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* LIABILITIES & EQUITY */}
                        <Card className="border-slate-200 dark:border-slate-800 h-full">
                            <CardHeader className="bg-slate-50 dark:bg-slate-900/50">
                                <CardTitle className="text-rose-600 flex items-center gap-2">
                                    <LANDMARK className="h-5 w-5" /> Liabilities & Equity
                                </CardTitle>
                                <CardDescription>What the hospital owes</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    <section>
                                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-1 mb-2">Liabilities</h4>
                                        {bsData?.liabilities.map((item: any) => (
                                            <div key={item.name} className="flex justify-between py-1 text-sm">
                                                <span>{item.name}</span>
                                                <span className="font-medium">{formatCurrency(item.amount)}</span>
                                            </div>
                                        ))}
                                    </section>

                                    <section>
                                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-1 mb-2">Equity & Retained Earnings</h4>
                                        {bsData?.equity.map((item: any) => (
                                            <div key={item.name} className="flex justify-between py-1 text-sm">
                                                <span>{item.name}</span>
                                                <span className="font-medium">{formatCurrency(item.amount)}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between py-1 text-sm italic text-indigo-500">
                                            <span>Reserve / Retained Earnings</span>
                                            <span>{formatCurrency(bsData?.retainedEarnings || 0)}</span>
                                        </div>
                                    </section>

                                    <div className="pt-4 flex justify-between items-center text-lg font-black bg-rose-50 dark:bg-rose-900/20 p-3 rounded-xl border border-rose-100 dark:border-rose-900/50">
                                        <span>Total Liab. & Equity</span>
                                        <span className="text-rose-600">{formatCurrency((bsData?.totalLiabilities || 0) + (bsData?.totalEquity || 0))}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function LANDMARK(props: any) {
    return <Landmark {...props} />
}
