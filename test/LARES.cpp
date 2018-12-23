#include <stdio.h>

using namespace std;

int main()
{
    int m, n, k, res;
    freopen("LARES.INP", "r", stdin);
    freopen("LARES.OUT", "w", stdout);
    scanf("%d %d %d", &m, &n, &k);
    if (n > m / 2)
    {
        k-= (n - m / 2);
        n = m / 2;
    };
    //now m >= 2n
    k-= (m - 2 * n);
    m = 2 * n;
    if (k <= 0) res = n;
    else res = n - (k + 2) / 3;
    printf("%d", res);
    return 0;
}
