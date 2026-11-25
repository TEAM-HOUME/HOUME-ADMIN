import { useState, type FormEvent } from 'react';

import { toast } from 'sonner';

import * as ui from '@styles/adminUi.css';

import { useDeleteRawProductMutation } from '../../apis/mutations/useDeleteRawProductMutation';
import * as shared from '../../rawProduct.css';
import { parseRawProductId } from '../../utils/rawProductForm';

interface RawProductDangerZoneProps {
  /** 지금 보고 있는 상품 ID를 기본값으로 채운다 */
  defaultId: number | null;
  onDeleted: (rawProductId: number) => void;
}

/** 위험 구역 — RAW 상품 영구 삭제 */
function RawProductDangerZone({
  defaultId,
  onDeleted,
}: RawProductDangerZoneProps) {
  const [idInput, setIdInput] = useState(
    defaultId !== null ? String(defaultId) : ''
  );
  const { mutate: deleteRawProduct, isPending } = useDeleteRawProductMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = parseRawProductId(idInput);
    if (id === null) {
      toast.error('삭제할 RAW 상품 ID를 입력해주세요.');
      return;
    }
    if (!window.confirm(`RAW 상품 ID ${id}를 정말로 삭제하시겠습니까?`)) return;
    deleteRawProduct(id, {
      onSuccess: () => {
        toast.success('RAW 상품이 삭제되었습니다.');
        onDeleted(id);
      },
    });
  };

  return (
    <form className={ui.formStack} onSubmit={handleSubmit}>
      <div className={shared.inlineRow}>
        <input
          className={`${ui.input} ${shared.grow}`}
          type="number"
          value={idInput}
          onChange={(e) => setIdInput(e.target.value)}
          placeholder="삭제할 ID"
        />
        <button className={ui.button.danger} type="submit" disabled={isPending}>
          삭제
        </button>
      </div>
      <p className={ui.errorText}>삭제된 데이터는 복구할 수 없습니다.</p>
    </form>
  );
}

export default RawProductDangerZone;
