/**
 * 보여줄 페이지 번호(0부터)와 그 사이 생략 표시.
 * 처음 · 끝 페이지와 현재 페이지 앞뒤 2개만 보여준다 (SSR buildRawProductPaginationButtons).
 */
export const getVisiblePages = (
  currentPage: number,
  totalPages: number
): (number | 'ellipsis')[] => {
  const total = Math.max(totalPages, 1);
  const pages: number[] = [];
  for (let page = 0; page < total; page += 1) {
    if (page === 0 || page === total - 1 || Math.abs(page - currentPage) <= 2) {
      pages.push(page);
    }
  }

  const result: (number | 'ellipsis')[] = [];
  pages.forEach((page, index) => {
    const previous = pages[index - 1];
    if (previous !== undefined && page - previous > 1) result.push('ellipsis');
    result.push(page);
  });
  return result;
};
