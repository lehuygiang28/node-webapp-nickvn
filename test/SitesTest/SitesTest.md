## Sites Test
# Test login form (Code: 1)
**Method: POST**
**Url: `/dang-nhap`**
<table>
    <thead>
        <tr>
            <th>NO.</th>
            <th>UserName</th>
            <th>Password</th>
            <th>Expect</th>
            <th>Should</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1.1</td>
            <td>tester</td>
            <td>2</td>
            <td rowspan='14'>Login false</td>
            <td rowspan='14'>Return login page</td>
            <td>Correct username, wrong password</td>
        </tr>
        <tr>
            <td>1.2</td>
            <td>this-not-a-user-name</td>
            <td>not-a-password</td>
            <td>Wrong username, password</td>
        </tr>
        <tr>
            <td>1.3</td>
            <td>this-not-a-user-name</td>
            <td>[NO INPUT]</td>
            <td>Wrong username, no input password</td>
        </tr>
        <tr>
            <td>1.4</td>
            <td>[NO INPUT]</td>
            <td>not-a-password</td>
            <td>Wrong password, no input username</td>
        </tr>
        <tr>
            <td>1.5</td>
            <td><code>''</code></td>
            <td>not-a-password</td>
            <td>Empty username, wrong password</td>
        </tr>
        <tr>
            <td>1.6</td>
            <td>this-not-a-user-name</td>
            <td><code>''</code></td>
            <td>Empty password, wrong username</td>
        </tr>
        <tr>
            <td>1.7</td>
            <td>tester</td>
            <td><code>''</code></td>
            <td>Empty password, wrong username</td>
        </tr>
        <tr>
            <td>1.8</td>
            <td>&ltscript&gtalert('hihi1245')&lt/script&gt</td>
            <td>not-a-password</td>
            <td>Try XSS on username</td>
        </tr>
        <tr>
            <td>1.9</td>
            <td>this-not-a-user-name</td>
            <td>&ltscript&gtalert('hihi1245')&lt/script&gt</td>
            <td>Try XSS on password, wrong username</td>
        </tr>
        <tr>
            <td>1.10</td>
            <td>tester</td>
            <td>&ltscript&gtalert('hihi1245')&lt/script&gt</td>
            <td>Try XSS on password, correct username</td>
        </tr>
        <tr>
            <td>1.11</td>
            <td>123566</td>
            <td>&ltscript&gtalert('hihi1245')&lt/script&gt</td>
            <td>Username is <code>Number</code>, wrong password</td>
        </tr>
        <tr>
            <td>1.12</td>
            <td>this-not-a-user</td>
            <td>123456</td>
            <td>Password is <code>Number</code>, wrong username</td>
        </tr>
        <tr>
            <td>1.12</td>
            <td>tester</td>
            <td><code>undefined</code></td>
            <td>Password is <code>Number</code>, correct username</td>
        </tr>
        <tr>
            <td>1.13</td>
            <td>this-not-a-user</td>
            <td><code>undefined</code></td>
            <td>Password is <code>Number</code>, wrong username</td>
        </tr>
        <tr>
            <td>1.14</td>
            <td>tester</td>
            <td><code>1</code></td>
            <td>Login success</td>
            <td>Return to home page</td>
            <td>Password is <code>Number</code>, correct username, password</td>
        </tr>
        <tr>
            <td>1.14</td>
            <td>tester</td>
            <td>1</td>
            <td>Login success</td>
            <td>Return to home page</td>
            <td>Correct username, password</td>
        </tr>
    </tbody>
</table>
<br>

# Test GET on sites controller (Code 2)
**Method: GET**
<table>
    <thead>
        <tr>
            <th>NO</th>
            <th>Uri (GET)</th>
            <th>Expect</th>
            <th>Should</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>2.1</td>
            <td><code>/</code></td>
            <td>Status Code: 200</td>
            <td>Return a home page</td>
            <td>Get the index page of web</td>
        </tr>
        <tr>
            <td>2.2</td>
            <td><code>/dang-nhap</code></td>
            <td>Status Code: 200</td>
            <td>Return a home page</td>
            <td>Get the login page</td>
        </tr>
        <tr>
            <td>2.3</td>
            <td><code>/dang-ky</code></td>
            <td>Status Code: 200</td>
            <td>Return a home page</td>
            <td>Get the signup page</td>
        </tr>
        <tr>
            <td>2.3</td>
            <td><code>/dang-xuat</code></td>
            <td>Status Code: 302</td>
            <td>Return a home page</td>
            <td>Request sign out but no login yet</td>
        </tr>
        <tr>
            <td>2.3</td>
            <td><code>/this-not-exists-in-server</code></td>
            <td>Status Code: 404</td>
            <td>Redirect to error page</td>
            <td>Request a page not exists in website</td>
        </tr>
    </tbody>
</table>

#### Test 
