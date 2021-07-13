import React from "react";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import RepoTable, { Props } from "../tables/repo-table";

function renderRepoTable(props: Partial<Props> = {}) {
    const defaultProps: Props = {
        onSearchChange() {
          return;
        },
      };
    return render(<RepoTable {...defaultProps} {...props} />);
  }

describe("<RepoTable />", () => {
  test("should display repo table", async () => {
  });
});

test("should allow entering a search term", async () => {
    const onSearchChange = jest.fn();
    const { findByTestId } = renderRepoTable({ onSearchChange });
    const searchInput = await findByTestId("search-input");
  
    fireEvent.change(searchInput, { target: { value: "test" } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
  
    expect(onSearchChange).toHaveBeenCalledWith("test");
  });