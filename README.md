此代码为[地球联合百科](https://wiki.unitedearth.cc/)的界面js和css代码库，由[BearBin](https://wiki.unitedearth.cc/User:BearBin)管理，地球联合百科的界面管理员参与维护<del>（其实基本就是一个人在干）</del>。

部分小工具的源代码复制或参考自[萌娘百科](https://zh.moegirl.org.cn)，依[CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/)协议引入。

### 代码结构
- [common](common)中为全站各皮肤的css和js源代码，如common.css等。
- [gadget](gadget)中为小工具的源代码。
- [group](group)中为针对用户组生效的源代码。

### 代码规范
- 若js代码以ES6标准进行编写，请使用[tsconfig.json](tsconfig.json)中的规则进行编译以兼容ES3标准，编译后请在头尾加上被注释的`<pre>`或`<nowiki>`以免其中源代码（诸如3个波浪号）被自动解析：
    ```javascript
    // <pre>

    $(function () {
        ...
    }

    // </pre>
    ```
- css代码建议使用[.stylelintrc.json](.stylelintrc.json)中的规则进行格式化。格式化后的部分源代码直接复制到wiki上可能会出现报错或警告，请直接无视。

### 参与维护
- 您可以在本仓库Pull Request，但本站目前没有使用机器人自动部署源代码，因此建议您在地球联合百科的相应讨论页面提交编辑请求。
- 另请界面管理员注意：在站内处理编辑请求时，请注意在编辑摘要中替请求者署名。