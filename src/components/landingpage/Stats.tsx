// components/Stats.tsx
import { Stat } from '@/lib/index';

const Stats = () => {
  const stats: Stat[] = [
    { number: '5,000+', label: 'Weddings Planned', color: 'text-primary' },
    { number: '1,200+', label: 'Verified Vendors', color: 'text-secondary' },
    { number: '50+', label: 'Cities Covered', color: 'text-accent' },
    { number: '98%', label: 'Happy Couples', color: 'text-primary' },
  ];

  return (
    <div className="container mx-auto px-4 -mt-16 relative z-10">
      <div className="bg-white rounded-xl shadow-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;