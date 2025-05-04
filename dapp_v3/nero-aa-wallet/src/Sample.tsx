import { useState, useEffect } from 'react'
import { ERC20_ABI } from '@/constants/abi'
// import CreateTokenFactory from '@/abis/ERC20/CreateTokenFactory.json'
import { useSignature, useSendUserOp } from '@/hooks'

const Sample = () => {
  const { AAaddress, isConnected } = useSignature()
  const { execute, waitForUserOpResult, checkUserOpStatus } = useSendUserOp()
  const [isLoading, setIsLoading] = useState(false)
  const [userOpHash, setUserOpHash] = useState<string | null>(null)
  const [txStatus, setTxStatus] = useState<string>('')
  const [isPolling, setIsPolling] = useState(false)

  useEffect(() => {
    let intervalId: number | null = null

    const pollStatus = async () => {
      if (!userOpHash || !isPolling) return

      try {
        const status = await checkUserOpStatus(userOpHash)
        if (status === true) {
          setTxStatus('成功しました！')
          setIsPolling(false)
        } else {
          setTxStatus('失敗しました')
          setIsPolling(false)
        }
      } catch (error) {
        console.error('ステータス確認エラー:', error)
        setTxStatus('エラーが発生しました')
        setIsPolling(false)
      }
    }

    if (userOpHash && isPolling) {
      setTxStatus('処理中...')
      intervalId = window.setInterval(pollStatus, 3000) as unknown as number // 3秒ごとにステータスを確認
      pollStatus()
    }

    return () => {
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [userOpHash, isPolling, checkUserOpStatus])

  const handleExecute = async () => {
    if (!isConnected) {
      alert('not connected')
      return
    }

    setIsLoading(true)
    setUserOpHash(null)
    setTxStatus('')

    try {
      await execute({
        function: 'approve',
        contractAddress: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed',
        abi: ERC20_ABI,
        value: 0,
        params: ['0x5a6680dfd4a77feea0a7be291147768eaa2414ad', BigInt(1000000000000000000)],
      })

      // await execute({
      //   function: 'createToken',
      //   contractAddress: '0x00ef47f5316A311870fe3F3431aA510C5c2c5a90',
      //   abi: CreateTokenFactory.abi,
      //   params: ['test', 'aiueo', '100000000'],
      // })

      const result = await waitForUserOpResult()
      setUserOpHash(result.userOpHash)

      setIsPolling(true)

      if (result.result === true) {
        setTxStatus('成功しました！')
        setIsPolling(false)
      } else if (result.transactionHash) {
        setTxStatus('トランザクションハッシュ: ' + result.transactionHash)
      }
    } catch (error) {
      console.error('実行エラー:', error)
      setTxStatus('エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: '40px 30px',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontSize: '1.2rem',
          marginBottom: '20px',
          color: '#333',
        }}
      >
        {AAaddress}
      </p>
      <button
        onClick={handleExecute}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          borderRadius: '5px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
        }}
      >
        {isLoading ? '実行中...' : 'Sample send userOp'}
      </button>

      {userOpHash && (
        <div style={{ marginTop: '20px', maxWidth: '500px' }}>
          <p style={{ wordBreak: 'break-all', fontSize: '0.9rem' }}>
            <strong>UserOpHash:</strong> {userOpHash}
          </p>
          <p
            style={{
              marginTop: '10px',
              color: txStatus.includes('成功')
                ? 'green'
                : txStatus.includes('失敗')
                  ? 'red'
                  : 'blue',
            }}
          >
            <strong>ステータス:</strong> {txStatus || '不明'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Sample
