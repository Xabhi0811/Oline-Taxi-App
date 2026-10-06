import { useContext } from 'react';
import { CaptainDataContext } from '../context/contexts';
export default function CaptainDetails() {
  const { captain } = useContext(CaptainDataContext);
  return <div>
    <div className="captain-profile">
      <span className="captain-avatar" aria-hidden="true"><i className="ri-user-line"/></span>
      <div className="min-w-0"><h1 className="text-xl font-semibold capitalize">{captain?.fullname?.firstname} {captain?.fullname?.lastname}</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, captain</p></div>
    </div>
    <dl className="captain-vehicle">
      <div><dt>Vehicle</dt><dd className="capitalize">{captain?.vehicle?.vehicleType || '—'}</dd></div>
      <div><dt>License plate</dt><dd>{captain?.vehicle?.plate || '—'}</dd></div>
    </dl>
  </div>;
}
