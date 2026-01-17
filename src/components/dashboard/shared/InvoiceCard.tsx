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
    [invoiceStatus.PAID]: 'bg-green-100 text-green-800',
    [invoiceStatus.PARTIAL]: 'bg-yellow-100 text-yellow-800',
    [invoiceStatus.UNPAID]: 'bg-red-100 text-red-800',
  };

  const remaining = Number(amount) - Number(paid);

  return (
    <div className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'>
      <div className='flex items-center justify-between mb-2'>
        <div>
          <p className='font-semibold text-gray-900'>{patientName}</p>
          <p className='text-sm text-gray-600'>{invoiceNumber}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}
        >
          {InvoiceStatusLabels[status]}
        </span>
      </div>
      <div className='flex items-center justify-between text-sm'>
        <div>
          <span className='text-gray-600'>المبلغ: </span>
          <span className='font-semibold'>{amount} ج</span>
        </div>
        <div>
          <span className='text-gray-600'>المتبقي: </span>
          <span className='font-semibold text-red-600'>{remaining} ج</span>
        </div>
        {onPaymentClick && (
          <button
            onClick={onPaymentClick}
            className='bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700'
          >
            تسجيل دفعة
          </button>
        )}
      </div>
    </div>
  );
}
