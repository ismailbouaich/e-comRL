import {
  Pagination as PaginationWrapper,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/ui/pagination';
import PropTypes from 'prop-types';


const Pagination = ({ currentPage, totalPages, handlePageChange, isFetching }) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-auto">
      <PaginationWrapper>
        {currentPage > 1 && (
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            isFetching={isFetching}
          />
        )}
        <PaginationContent>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handlePageChange(i + 1)}
                isActive={i + 1 === currentPage}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>
        {currentPage < totalPages && (
          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            isFetching={isFetching}
          />
        )}
      </PaginationWrapper>
    </div>
  );
};

Pagination.propTypes = {
    currentPage: PropTypes.string.isRequired,
    totalPages: PropTypes.string.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
  };
export default Pagination;
