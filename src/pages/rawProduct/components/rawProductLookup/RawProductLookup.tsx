import { useState, type FormEvent } from 'react';

import { toast } from 'sonner';

import * as ui from '@styles/adminUi.css';

import * as shared from '../../rawProduct.css';
import { parseRawProductId } from '../../utils/rawProductForm';

interface RawProductLookupProps {
  onLookup: (rawProductId: number) => void;
}

/** 상품 ID로 바로 찾기 */
function RawProductLookup({ onLookup }: RawProductLookupProps) {
  const [idInput, setIdInput] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = parseRawProductId(idInput);
    if (id === null) {
      toast.error('RAW 상품 ID를 입력해주세요.');
      return;
    }
    onLookup(id);
  };

  return (
    <form className={shared.inlineRow} onSubmit={handleSubmit}>
      <input
        className={`${ui.input} ${shared.grow}`}
        type="number"
        value={idInput}
        onChange={(e) => setIdInput(e.target.value)}
        placeholder="System ID 입력"
      />
      <button className={ui.button.secondary} type="submit">
        조회
      </button>
    </form>
  );
}

export default RawProductLookup;
