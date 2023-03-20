此代码为[地球联合百科](https://wiki.unitedearth.cc/)的界面js和css代码库，由BearBin管理，地球联合百科的界面管理员参与维护<del>（其实基本就是一个人在干）</del>。

部分小工具的源代码复制或参考自[萌娘百科](https://zh.moegirl.org.cn)。

## 代码结构
- [common](common)中为全站各皮肤的css和js源代码，如common.css等。
- [gadget](gadget)中为小工具的源代码。
- [group](group)中为针对用户组生效的源代码。

## 代码规范
- js代码使用[tsconfig.json](tsconfig.json)中的规则进行编译以兼容MediaWiki。
- css代码使用[.stylelintrc.json](.stylelintrc.json)中的规则进行格式化。