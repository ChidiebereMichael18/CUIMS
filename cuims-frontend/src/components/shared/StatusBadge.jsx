export function StatusBadge({ status }) {
  if (!status) return null;
  const s = status.toLowerCase();
  
  let type = 'gray';
  if (['open', 'accepted', 'approved', 'active'].includes(s)) type = 'green';
  if (['pending', 'draft', 'in progress'].includes(s)) type = 'amber';
  if (['closed', 'rejected', 'cancelled', 'revoked'].includes(s)) type = 'red';
  if (['under review'].includes(s)) type = 'blue';

  return (
    <span className={`badge badge-${type}`} style={{ textTransform: 'capitalize' }}>
      {status}
    </span>
  );
}

export function TypeBadge({ type }) {
  if (!type) return null;
  return (
    <span className="badge badge-gray" style={{ textTransform: 'capitalize' }}>
      {type}
    </span>
  );
}
