import React from 'react';
import { Character, Locale } from '../types/Character';
import { Icon } from '@iconify/react';

interface CharacterInfoProps {
  character: Character;
  locale: Locale;
}

interface Row {
  icon: string;
  label: string;
  value: string;
}

const CharacterInfo: React.FC<CharacterInfoProps> = ({ character, locale }) => {
  if (!character) return null;

  const rows: Row[] = [
    { icon: 'mdi:gender-male-female', label: 'SEX', value: character.gender },
    { icon: 'mdi:cake-variant', label: 'BIRTH', value: character.birthDate },
    { icon: 'mdi:briefcase', label: 'JOB', value: character.occupation },
  ];

  return (
    <div className="animate-slideIn">
      <div className="text-[15px] font-bold text-white mb-4">{locale.char_info_title}</div>

      <div className="grid grid-cols-2 gap-x-10 gap-y-5">
        {rows.map(row => (
          <div key={row.label} className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-[13px] flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <Icon icon={row.icon} width="18" height="18" color="#ffffff" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] tracking-wide text-white/55 uppercase">{row.label}</span>
              <span className="text-[15px] font-semibold text-white">{row.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterInfo;
