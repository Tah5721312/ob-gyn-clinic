import { invoiceStatus, InvoiceStatusLabels } from '@/lib/enumdb';

interface InvoiceCardProps {
  invoiceNumber: string;
  patientName: string;
  amount: string;
  paid: string;
  status: invoiceStatus;
  onPaymentClick?: () => void;
}

export function InvoiceCard({
  invoiceNumber,
  patientName,
  amount,
  paid,
  status,
  onPaymentClick,
}: InvoiceCardProps) {
  const statusColors = {
    [invoiceStatus.PAID]: 'bg-green-100 text-green-700 border-green-200',
    [invoiceStatus.PARTIAL]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    [invoiceStatus.UNPAID]: 'bg-red-100 text-red-700 border-red-200',
  };

  const remaining = Number(amount) - Number(paid);

  return (
    <div className='group bg-white border border-gray-100 rounded-xl p-5 hover:border-gray-200 hover:shadow-lg transition-all duration-300'>
      <div className='flex items-center justify-between mb-4'>
        <div className="flex flex-col">
          <h4 className='font-bold text-gray-900 text-lg mb-1'>{patientName}</h4>
          <span className='text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded w-fit'>{invoiceNumber}</span>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${statusColors[status]}`}
        >
          {InvoiceStatusLabels[status]}
        </span>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-4 grid grid-cols-2 gap-4">
        <div>
          <span className='text-xs text-gray-500 block mb-1'>المبلغ الإجمالي</span>
          <span className='font-bold text-gray-900'>{amount} ج.م</span>
        </div>
        <div className="text-left dir-ltr">
          <span className='text-xs text-gray-500 block mb-1 text-right'>المتبقي</span>
          <span className={`font-bold text-right block ${remaining > 0 ? 'text-red-600' : 'text-green-600'}`}>{remaining} ج.م</span>
        </div>
      </div>

      <div className='flex items-center justify-between mt-2 pt-2 border-t border-gray-100'>
        <div className="text-xs text-gray-400 font-medium">
          تم الدفع: {paid} ج.م
        </div>
        {onPaymentClick && (
          <button
            onClick={onPaymentClick}
            className='bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-95'
          >
            تسجيل دفعة
          </button>
        )}
      </div>
    </div>
  );
}
