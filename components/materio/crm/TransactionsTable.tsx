"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { MaterioCard } from "./MaterioCard";

export type TransactionRow = {
  id: string;
  primary: string;
  secondary?: string;
  meta?: string;
  amount?: string;
  status: string;
  href?: string;
};

type TransactionsTableProps = {
  rows: TransactionRow[];
  title?: string;
  subheader?: string;
  columns?: { primary: string; secondary?: string; meta?: string; amount?: string; status: string };
  emptyMessage?: string;
};

const defaultColumns = {
  primary: "Item",
  secondary: "Detail",
  meta: "Context",
  amount: "Value",
  status: "Status",
};

function statusChipColor(status: string): "success" | "warning" | "error" | "default" | "primary" {
  const s = status.toLowerCase();
  if (s.includes("go") || s.includes("ready") || s.includes("approved") || s.includes("open")) return "success";
  if (s.includes("risk") || s.includes("pending") || s.includes("progress")) return "warning";
  if (s.includes("block") || s.includes("fail") || s.includes("p1")) return "error";
  return "default";
}

export function TransactionsTable({
  rows,
  title = "Recent Transactions",
  subheader = "Releases and issues requiring attention",
  columns = defaultColumns,
  emptyMessage = "No items in this period.",
}: TransactionsTableProps) {
  return (
    <MaterioCard title={title} subheader={subheader} noPadding>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{columns.primary}</TableCell>
              {columns.secondary && <TableCell>{columns.secondary}</TableCell>}
              {columns.meta && <TableCell>{columns.meta}</TableCell>}
              {columns.amount && <TableCell align="right">{columns.amount}</TableCell>}
              <TableCell align="right">{columns.status}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} hover sx={{ "&:last-child td": { border: 0 } }}>
                  <TableCell>
                    {row.href ? (
                      <Link href={row.href} style={{ textDecoration: "none", color: "inherit", fontWeight: 500 }}>
                        {row.primary}
                      </Link>
                    ) : (
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {row.primary}
                      </Typography>
                    )}
                  </TableCell>
                  {columns.secondary && (
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {row.secondary ?? "—"}
                      </Typography>
                    </TableCell>
                  )}
                  {columns.meta && (
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {row.meta ?? "—"}
                      </Typography>
                    </TableCell>
                  )}
                  {columns.amount && (
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {row.amount ?? "—"}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell align="right">
                    <Chip label={row.status} size="small" color={statusChipColor(row.status)} variant="outlined" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {rows.length > 0 && (
        <Box sx={{ px: 3, py: 1.5, borderTop: 1, borderColor: "divider" }}>
          <Typography variant="caption" color="text.secondary">
            Showing {rows.length} item{rows.length === 1 ? "" : "s"}
          </Typography>
        </Box>
      )}
    </MaterioCard>
  );
}
