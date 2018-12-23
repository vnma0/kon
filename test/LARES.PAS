{THI SINH NAY KHAI BAO MANG VUOT QUA BO NHO CHO PHEP}
{$MODE OBJFPC}
program TaoQuan;
const
  InputFile  = 'LARES.INP';
  OutputFile = 'LARES.OUT';
var
  f: TextFile;
  m, n, k, res: Integer;
  a: array[1..10000000] of LongInt;
begin
  //Lenh nay phai co, neu khong FPC Optimizer se coi nhu khong co mang a
  a[1] := 1;

  AssignFile(f, InputFile); Reset(f);
  ReadLn(f, m, n, k);
  CloseFile(f);
  if n > m div 2 then
    begin
      k := k - (n - m div 2);
      n := m div 2;
    end;
  //now, m >= 2n
  if m > 2 * n then
    begin
      k := k - (m - 2 * n);
      m := 2 * n;
    end;
  if k <= 0 then res := n
  else res := n - (k + 2) div 3;
  AssignFile(f, OutputFile); Rewrite(f);
  Write(f, res);
  CloseFile(f);
end.
