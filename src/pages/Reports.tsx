import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { SalesData, User, Product } from '../types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

const Reports: React.FC = () => {
  const { users, products, salesData, setSalesData } = useStore();
  const [selectedReport, setSelectedReport] = useState<string>('sales');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock sales data
  useEffect(() => {
    const mockSalesData: SalesData[] = [
      {
        id: '1',
        productId: '1',
        productName: 'Wireless Headphones',
        quantity: 2,
        price: 199.99,
        total: 399.98,
        customerId: '1',
        customerName: 'John Doe',
        date: '2024-01-20',
      },
      {
        id: '2',
        productId: '2',
        productName: 'Laptop Stand',
        quantity: 1,
        price: 49.99,
        total: 49.99,
        customerId: '2',
        customerName: 'Jane Smith',
        date: '2024-01-19',
      },
      {
        id: '3',
        productId: '4',
        productName: 'Running Shoes',
        quantity: 3,
        price: 89.99,
        total: 269.97,
        customerId: '3',
        customerName: 'Bob Johnson',
        date: '2024-01-18',
      },
      {
        id: '4',
        productId: '5',
        productName: 'Programming Book',
        quantity: 1,
        price: 39.99,
        total: 39.99,
        customerId: '4',
        customerName: 'Alice Brown',
        date: '2024-01-17',
      },
    ];
    setSalesData(mockSalesData);
  }, [setSalesData]);

  const reportTypes = [
    { id: 'sales', name: 'Sales Report', icon: BarChart3, description: 'Revenue and sales analytics' },
    { id: 'users', name: 'User Report', icon: PieChart, description: 'User demographics and activity' },
    { id: 'products', name: 'Product Report', icon: TrendingUp, description: 'Product performance metrics' },
  ];

  const generatePDF = async (data: any[], title: string, columns: any[]) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(title, 14, 22);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Add table
    (doc as any).autoTable({
      head: [columns.map(col => col.header)],
      body: data.map(row => columns.map(col => col.accessor(row))),
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] },
    });
    
    doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
  };

  const generateExcel = (data: any[], title: string, columns: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map(row => 
        columns.reduce((obj, col) => {
          obj[col.header] = col.accessor(row);
          return obj;
        }, {} as any)
      )
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${title.toLowerCase().replace(/\s+/g, '_')}.xlsx`);
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    setIsGenerating(true);
    
    try {
      let data: any[] = [];
      let title = '';
      let columns: any[] = [];

      switch (selectedReport) {
        case 'sales':
          data = salesData;
          title = 'Sales Report';
          columns = [
            { header: 'Product', accessor: (row: SalesData) => row.productName },
            { header: 'Customer', accessor: (row: SalesData) => row.customerName },
            { header: 'Quantity', accessor: (row: SalesData) => row.quantity },
            { header: 'Price', accessor: (row: SalesData) => `$${row.price.toFixed(2)}` },
            { header: 'Total', accessor: (row: SalesData) => `$${row.total.toFixed(2)}` },
            { header: 'Date', accessor: (row: SalesData) => row.date },
          ];
          break;
        case 'users':
          data = users;
          title = 'User Report';
          columns = [
            { header: 'Name', accessor: (row: User) => row.name },
            { header: 'Email', accessor: (row: User) => row.email },
            { header: 'Role', accessor: (row: User) => row.role },
            { header: 'Status', accessor: (row: User) => row.status },
            { header: 'Created', accessor: (row: User) => row.createdAt },
          ];
          break;
        case 'products':
          data = products;
          title = 'Product Report';
          columns = [
            { header: 'Name', accessor: (row: Product) => row.name },
            { header: 'Category', accessor: (row: Product) => row.category },
            { header: 'Price', accessor: (row: Product) => `$${row.price.toFixed(2)}` },
            { header: 'Stock', accessor: (row: Product) => row.stock },
            { header: 'Status', accessor: (row: Product) => row.status },
            { header: 'Created', accessor: (row: Product) => row.createdAt },
          ];
          break;
      }

      if (format === 'pdf') {
        await generatePDF(data, title, columns);
      } else {
        generateExcel(data, title, columns);
      }

      toast.success(`${title} exported successfully as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export report');
    } finally {
      setIsGenerating(false);
    }
  };

  const getReportStats = () => {
    switch (selectedReport) {
      case 'sales':
        const totalRevenue = salesData.reduce((sum, sale) => sum + sale.total, 0);
        const totalOrders = salesData.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        return [
          { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}` },
          { label: 'Total Orders', value: totalOrders.toString() },
          { label: 'Avg Order Value', value: `$${avgOrderValue.toFixed(2)}` },
        ];
      case 'users':
        const activeUsers = users.filter(user => user.status === 'active').length;
        const adminUsers = users.filter(user => user.role === 'admin').length;
        return [
          { label: 'Total Users', value: users.length.toString() },
          { label: 'Active Users', value: activeUsers.toString() },
          { label: 'Admin Users', value: adminUsers.toString() },
        ];
      case 'products':
        const activeProducts = products.filter(product => product.status === 'active').length;
        const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
        return [
          { label: 'Total Products', value: products.length.toString() },
          { label: 'Active Products', value: activeProducts.toString() },
          { label: 'Total Value', value: `$${totalValue.toLocaleString()}` },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center">
            <FileText className="w-8 h-8 mr-3 text-brand-primary" />
            Reports & Analytics
          </h1>
          <p className="text-text-secondary mt-1">
            Generate and export business reports
          </p>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <motion.button
              key={report.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedReport(report.id)}
              className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                selectedReport === report.id
                  ? 'border-brand-primary bg-brand-primary/10 dark:bg-brand-primary/20'
                  : 'border-surface-3 hover:border-surface-4'
              }`}
            >
              <div className="flex items-center mb-3">
                <Icon className={`w-8 h-8 mr-3 ${
                  selectedReport === report.id ? 'text-brand-primary' : 'text-text-secondary'
                }`} />
                <h3 className={`text-lg font-semibold ${
                  selectedReport === report.id ? 'text-brand-primary' : 'text-text-primary'
                }`}>
                  {report.name}
                </h3>
              </div>
              <p className={`text-sm ${
                selectedReport === report.id ? 'text-brand-primary' : 'text-text-secondary'
              }`}>
                {report.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Report Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {getReportStats().map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Export Controls */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="input-field"
                placeholder="Start Date"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="input-field"
                placeholder="End Date"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleExport('pdf')}
              disabled={isGenerating}
              className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Export PDF'}
            </button>
            <button
              onClick={() => handleExport('excel')}
              disabled={isGenerating}
              className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Export Excel'}
            </button>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Report Preview
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {selectedReport === 'sales' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  </>
                )}
                {selectedReport === 'users' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  </>
                )}
                {selectedReport === 'products' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {selectedReport === 'sales' && salesData.slice(0, 5).map((sale) => (
                <tr key={sale.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{sale.productName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{sale.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{sale.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${sale.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{sale.date}</td>
                </tr>
              ))}
              {selectedReport === 'users' && users.slice(0, 5).map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.status}</td>
                </tr>
              ))}
              {selectedReport === 'products' && products.slice(0, 5).map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{product.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
