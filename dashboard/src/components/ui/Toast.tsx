import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToastStore } from '@/store/toast.store';

const ICONS = {
  success: <CheckCircle size={18} color="var(--success)" />,
  error:   <XCircle    size={18} color="var(--error)"   />,
  info:    <Info       size={18} color="var(--primary)"  />,
  warning: <AlertTriangle size={18} color="var(--warning)" />,
};

export function ToastContainer() {
  const { toasts, dismiss } = useToastStore();
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {ICONS[t.type]}
          <span className="toast-msg">{t.message}</span>
          <button onClick={() => dismiss(t.id)} style={{ color: 'var(--text-muted)', lineHeight: 0 }}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
