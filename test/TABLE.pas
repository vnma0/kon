{$MODE OBJFPC}
program Icons;
const
  InputFile  = 'TABLE.INP';
  OutputFile = 'TABLE.OUT';
var
  n, k: Int64;

procedure Enter;
var
  f: TextFile;
begin
  AssignFile(f, InputFile); Reset(f);
  ReadLn(f, n);
  CloseFile(f);
end;

procedure Solve;
var
  f: TextFile;
begin
  k := Trunc(Sqrt(n));
  AssignFile(f, OutputFile); Rewrite(f);
  if Sqr(k) = n then WriteLn(f, k, ' ', k)
  else
    if k * (k + 1) >= n then WriteLn(f, k, ' ', k + 1)
    else WriteLn(f, k + 1, ' ', k + 1);
  CloseFile(f);
end;

begin
  Enter;
  Solve;
end.