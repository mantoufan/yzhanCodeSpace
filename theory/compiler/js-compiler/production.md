# Production 
诺姆 · 乔姆斯基  
Using to describe a programming language  
## Example
using pa, gu to compose a language  
structure:
- Terminal Symbol: pa | gu  
- Non-terminal Symbol: other words
## Symbol
### Terminal Symbol (End Symbol, Endpoints): pa | gu 
### Non Terminal Symbol: Words

## BNF 巴克斯-诺尔范式（Backus-Naur Form）
Production relationship ::= <Non-terminal Symbol> 'Terminal Symbol'
### Example
<words> ::= 'pa' | 'gu'
<alien language> ::= <words> | <alien language> <words>

#### Challenge 1
> gu gu pa
pa gu gu gu
pa

<words> ::= 'gu' 'gu' 'pa' | 'pa' 'gu' 'gu' 'gu' | 'pa'  
<alien language> ::= <words> | <alien language> <words>

#### Challenge 2
> pa will not displayed in succession
gu gu pa
pa gu gu gu
pa

<ggp> ::= 'gu gu pa'
<pggg> ::= 'pa gu gu gu'
<p> ::= 'pa'
<ggp-list> ::= <ggp> | <ggp-list> <ggp>
<pggg-list> ::= <pggg> | <pggg-list> <pggg>
<alien-stat> ::=  <pggg-list> <p> <gpp-list> | <p> <ggp-list> | <pggg-list> <gpp-list> | <pggg-list> <p> | <p> | <ggp-list> | <pggg-list>

#### Challenge 3
> gu gu pa and pa gu gu gu, the two quatities are equal.

<ggp> ::= 'gu gu pa'
<pggg> ::= 'pa gu gu gu'
<p> ::= 'pa'
<alien-list> ::= <p> | <pggg> <ggp> | <pggg> <alien-list> <ggp>

#### Challenge 4
> {} [] () will display in a matched pair

<brackets> ::= '' | '(' <brackets> ')' <brackets> | '[' <brackets> ']' <brackets> | '{' <brackets> '}' <brackets> 