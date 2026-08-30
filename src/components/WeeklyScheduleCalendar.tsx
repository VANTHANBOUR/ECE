import React from 'react';
import { Clock, Sun, Moon, Utensils, Music, BookOpen, Smile, Sparkles } from 'lucide-react';

const DAILY_SCHEDULE = [
  {
    time: '07:30 - 08:30',
    title: 'Morning Arrival & Trilingual Welcome',
    khmerTitle: 'ការមកដល់ និងស្វាគមន៍ ៣ ភាសា',
    desc: 'Health & temperature check, independent shoe/cubby organization, warm greetings in English, Khmer, and Mandarin.',
    icon: Sun,
    category: 'Welcome',
    color: '#F59E0B',
  },
  {
    time: '08:30 - 09:15',
    title: 'Morning Circle Time & Trilingual Songs',
    khmerTitle: 'ជួបជុំរង្វង់មូល និងច្រៀងចម្រៀង ៣ ភាសា',
    desc: 'Days of the week, weather exploration, thematic inquiry spark, trilingual calendar chant, movement exercises.',
    icon: Music,
    category: 'Circle Time',
    color: '#10B981',
  },
  {
    time: '09:15 - 10:15',
    title: 'Montessori & Play-Based Learning Centers',
    khmerTitle: 'មជ្ឈមណ្ឌលសិក្សា និងការលេងបែបម៉ុងតេសសូរី',
    desc: 'Sensory water/sand discovery tables, phonics & writing trays, math manipulative blocks, dramatic play grocery/clinic.',
    icon: Sparkles,
    category: 'Learning Centers',
    color: '#007A43',
  },
  {
    time: '10:15 - 10:45',
    title: 'Organic Fruit Snack & Handwashing Hygiene',
    khmerTitle: 'អាហារសម្រន់ផ្លែឈើ និងអនាម័យ',
    desc: 'Self-help hand washing routines, table etiquette, sharing seasonal local fruits (dragonfruit, banana, mango).',
    icon: Utensils,
    category: 'Snack',
    color: '#EC4899',
  },
  {
    time: '10:45 - 11:45',
    title: 'Outdoor Sensory & Gross Motor Discovery',
    khmerTitle: 'ការលេងក្រៅថ្នាក់ និងការអភិវឌ្ឍចលនា',
    desc: 'Parachute group games, safe turf balance logs, tricycle pathways, water splash sensory troughs, sand castle creation.',
    icon: Smile,
    category: 'Gross Motor',
    color: '#0EA5E9',
  },
  {
    time: '11:45 - 12:45',
    title: 'Nutritious Hot Lunch & Self-Feeding Skills',
    khmerTitle: 'អាហារថ្ងៃត្រង់ និងការញ៉ាំដោយខ្លួនឯង',
    desc: 'Balanced early childhood hot lunch, spoon & fork coordination, cleanup manners.',
    icon: Utensils,
    category: 'Lunch',
    color: '#8B5CF6',
  },
  {
    time: '12:45 - 14:30',
    title: 'Peaceful Nap & Lullaby Quiet Time',
    khmerTitle: 'ម៉ោងសម្រាកគេងថ្ងៃ និងតន្ត្រីបំពេ',
    desc: 'Dim ambient lights, soothing instrumental Khmer & classical lullabies, restorative sleep for brain growth.',
    icon: Moon,
    category: 'Rest',
    color: '#6366F1',
  },
  {
    time: '14:30 - 15:15',
    title: 'Afternoon Refreshment & Creative Arts',
    khmerTitle: 'អាហារសម្រន់រសៀល និងសិល្បៈច្នៃប្រឌិត',
    desc: 'Soy milk / snack, finger painting, clay sculpting, origami paper tearing, loose parts collage creation.',
    icon: Sparkles,
    category: 'Creative Arts',
    color: '#F97316',
  },
  {
    time: '15:15 - 16:00',
    title: 'Trilingual Storytelling & Library Immersion',
    khmerTitle: 'ការនិទានរឿង ៣ ភាសា និងបណ្ណាល័យ',
    desc: 'Puppet theatre, big book shared reading in English, Khmer, and Chinese, child oral retellings.',
    icon: BookOpen,
    category: 'Storytelling',
    color: '#007A43',
  },
  {
    time: '16:00 - 16:30',
    title: 'Reflection Circle & Cheerful Parent Dismissal',
    khmerTitle: 'ការឆ្លុះបញ្ចាំង និងការលាឪពុកម្តាយ',
    desc: 'Daily goodbye song, cubby packing, daily communication notebook handoff to parents and guardians.',
    icon: Sun,
    category: 'Dismissal',
    color: '#F59E0B',
  },
];

export const WeeklyScheduleCalendar: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
        <div className="max-w-2xl space-y-1 mb-6">
          <span className="text-xs font-black uppercase tracking-wider text-[#007A43]">
            Daily Rhythm & Framework
          </span>
          <h2 className="text-2xl font-black text-slate-900 font-['Outfit']">
            Early Childhood Trilingual Daily Schedule
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Carefully balanced flow of child-initiated play, teacher-facilitated trilingual immersion, sensory discovery, and nurturing care routines.
          </p>
        </div>

        {/* Schedule Timeline */}
        <div className="relative border-l-2 border-emerald-200 ml-4 sm:ml-6 space-y-6">
          {DAILY_SCHEDULE.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative pl-6 sm:pl-8 group">
                {/* Timeline Dot */}
                <div
                  className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform"
                >
                  <Icon className="w-4 h-4 text-[#007A43]" />
                </div>

                <div className="bg-slate-50 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-200 rounded-2xl p-4 sm:p-5 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-black text-[#007A43] bg-emerald-100/70 px-2.5 py-0.5 rounded-lg">
                      ⏰ {item.time}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs font-bold text-emerald-800 font-['Battambang'] mt-0.5">
                    {item.khmerTitle}
                  </p>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
