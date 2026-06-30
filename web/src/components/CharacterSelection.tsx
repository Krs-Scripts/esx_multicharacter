import React, { useState } from 'react';
import { Character, Locale } from '../types/Character';
import CharacterInfo from './CharacterInfo';
import { Icon } from '@iconify/react';
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchNui } from '../utils/fetchNui';

interface CharacterSelectionProps {
  initialCharacters: Character[];
  Candelete: boolean;
  MaxAllowedSlot: number;
  locale: Locale;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ initialCharacters, Candelete, MaxAllowedSlot, locale }) => {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    characters.find(char => char.isActive) || null
  );

  const selectByIndex = (index: number) => {
    if (index < 0 || index >= characters.length) return;
    const target = characters[index];
    if (!target) return;
    const updated = characters.map((c, i) => ({ ...c, isActive: i === index }));
    setCharacters(updated);
    setSelectedCharacter(updated[index]);
    fetchNui('SelectCharacter', { id: target.id });
  };

  const currentIndex = characters.findIndex(c => c.id === selectedCharacter?.id);

  const prevCharacter = () => {
    if (characters.length === 0) return;
    const i = currentIndex <= 0 ? characters.length - 1 : currentIndex - 1;
    selectByIndex(i);
  };

  const nextCharacter = () => {
    if (characters.length === 0) return;
    const i = currentIndex >= characters.length - 1 ? 0 : currentIndex + 1;
    selectByIndex(i);
  };

  const PlayCharacter = () => fetchNui('PlayCharacter');
  const handleCreateCharacter = () => fetchNui('CreateCharacter');

  const handleDeleteCharacter = () => {
    if (!selectedCharacter) return;
    const updatedRaw = characters.filter(char => char.id !== selectedCharacter.id);
    fetchNui('DeleteCharacter');

    if (updatedRaw.length > 0) {
      const updated = updatedRaw.map((char, index) => ({ ...char, isActive: index === 0 }));
      setCharacters(updated);
      setSelectedCharacter(updated[0]);
    } else {
      setCharacters([]);
      setSelectedCharacter(null);
      handleCreateCharacter();
    }
  };

  const nameParts = selectedCharacter ? selectedCharacter.name.trim().split(' ') : [];
  const firstName = nameParts.length > 0 ? nameParts[0] : '';
  const lastName = nameParts.slice(1).join(' ');

  const genderRaw = (selectedCharacter?.gender || '').toString().trim().toLowerCase();
  const isMale = genderRaw === 'm' || genderRaw === 'male' || genderRaw === '0' || genderRaw === 'maschio' || genderRaw === 'uomo';
  const accentColor = isMale ? '#00aaff' : '#ff2d8e';
  const accentGradient = isMale
    ? 'linear-gradient(135deg, #00aaff, #0077ff)'
    : 'linear-gradient(135deg, #ff5fa2, #ff2d8e)';
  const accentShadow = isMale ? 'rgba(0,170,255,0.45)' : 'rgba(255,45,142,0.45)';
  const accentShadowSlot = isMale ? 'rgba(0,170,255,0.35)' : 'rgba(255,45,142,0.35)';

  return (
    <div
      className="h-screen w-screen overflow-hidden relative text-white"
      style={{ fontFamily: 'Poppins, sans-serif', background: 'transparent' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(8,10,14,0.85) 0%, rgba(10,12,16,0.35) 35%, rgba(0,0,0,0) 70%)',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to left, rgba(8,10,14,0.85) 0%, rgba(10,12,16,0.35) 35%, rgba(0,0,0,0) 70%)',
        }}
      />

      <div className="absolute top-10 left-10 z-10">
        {selectedCharacter ? (
          <>
            <h1 className="text-[40px] font-extrabold leading-none tracking-wide uppercase">
              <span className="text-white">{firstName}</span>{' '}
              <span style={{ color: accentColor }}>{lastName}</span>
            </h1>
            <div className="flex items-center gap-2 mt-2 mb-7">
              <span className="text-[14px] font-bold tracking-[2px] text-white/90 uppercase">
                {locale.title}
              </span>
              <span className="text-[12px] font-semibold px-2 py-0.5 rounded-md bg-white/[0.1] text-white">
                {currentIndex + 1} / {MaxAllowedSlot}
              </span>
            </div>

            <CharacterInfo character={selectedCharacter} locale={locale} />
          </>
        ) : (
          <>
            <h1 className="text-[40px] font-extrabold leading-none tracking-wide uppercase">
              <span className="text-white">NO</span>{' '}
              <span className="text-[#00aaff]">CHARACTER</span>
            </h1>
            <div className="flex items-center gap-2 mt-2 mb-3">
              <span className="text-[14px] font-bold tracking-[2px] text-white/90 uppercase">
                {locale.title}
              </span>
              <span className="text-[12px] font-semibold px-2 py-0.5 rounded-md bg-white/[0.1] text-white">
                0 / {MaxAllowedSlot}
              </span>
            </div>
            <p className="text-[13px] text-white/60">Choose an empty slot to create a character..</p>
          </>
        )}
      </div>

      {selectedCharacter && (
        <button
          onClick={PlayCharacter}
          disabled={selectedCharacter.disabled}
          className={`absolute z-20 bottom-10 left-1/2 -translate-x-1/2 w-[68px] h-[68px] rounded-full flex items-center justify-center transition-all ${
            selectedCharacter.disabled ? 'bg-gray-600 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'
          }`}
          style={{
            background: selectedCharacter.disabled ? undefined : accentGradient,
            boxShadow: selectedCharacter.disabled ? undefined : `0 6px 20px ${accentShadow}`,
          }}
        >
          <Icon icon="si:play-fill" width="30" height="30" color="#ffffff" />
        </button>
      )}

      {characters.length > 1 && (
        <div className="absolute z-10 bottom-10 left-10 flex items-center gap-3">
          <button
            onClick={prevCharacter}
            className="w-11 h-11 rounded-[12px] flex items-center justify-center bg-white/[0.08] hover:bg-white/[0.16] transition-all"
          >
            <ChevronLeft size={20} color="#ffffff" />
          </button>
          <button
            onClick={nextCharacter}
            className="w-11 h-11 rounded-[12px] flex items-center justify-center bg-white/[0.08] hover:bg-white/[0.16] transition-all"
          >
            <ChevronRight size={20} color="#ffffff" />
          </button>
        </div>
      )}

      <div className="absolute z-10 bottom-10 right-10 flex items-center gap-3">
        {characters.map((char) => {
          const isActive = char.id === selectedCharacter?.id;
          return (
            <div
              key={char.id}
              className="w-11 h-11 rounded-[12px] flex items-center justify-center select-none pointer-events-none"
              style={
                isActive
                  ? { background: accentGradient, boxShadow: `0 4px 14px ${accentShadowSlot}` }
                  : { background: 'rgba(255,255,255,0.08)' }
              }
            >
              <Icon
                icon="material-symbols:person-rounded"
                width="20"
                height="20"
                color={isActive ? '#ffffff' : 'rgba(255,255,255,0.55)'}
              />
            </div>
          );
        })}

        {characters.length < MaxAllowedSlot && (
          <button
            onClick={handleCreateCharacter}
            className="w-11 h-11 rounded-[12px] flex items-center justify-center bg-white/[0.08] hover:bg-white/[0.16] transition-all cursor-pointer"
            title="Create character"
          >
            <Plus size={20} color="#ffffff" />
          </button>
        )}

        {Candelete && selectedCharacter && (
          <button
            onClick={handleDeleteCharacter}
            className="w-11 h-11 rounded-[12px] flex items-center justify-center bg-white/[0.08] hover:bg-white/[0.16] transition-all ml-1 cursor-pointer"
            title="Delete"
          >
            <Trash2 size={18} color="#ffffff" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CharacterSelection;
