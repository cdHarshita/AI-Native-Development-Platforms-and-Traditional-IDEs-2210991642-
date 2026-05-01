import { OrderStatus } from "@/types";

const styles: Record<OrderStatus, string> = {
  pending: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
  shipped: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
  delivered: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400",
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}
